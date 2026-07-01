import { NextRequest, NextResponse } from "next/server"
import { Weekday, type WeekdaySubject } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getUser(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session?.user
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 })
  }

  const dateObj = new Date(date)
  const weekdays = [Weekday.SUNDAY, Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY, Weekday.SATURDAY]
  const weekday = weekdays[dateObj.getDay()]

  // Get subjects for this weekday
  const weekdaySubjects: (WeekdaySubject & { subject: { id: string; name: string; type: string; color: string; userId: string; createdAt: Date; updatedAt: Date } })[] =
    await prisma.weekdaySubject.findMany({
      where: { weekday, userId: user.id },
      include: { subject: true },
    })

  // Check if it's a holiday
  const holiday = await prisma.holiday.findFirst({
    where: { date: dateObj, userId: user.id },
  })

  // Get attendance records for this date
  const records = await prisma.attendanceRecord.findMany({
    where: { date: dateObj, userId: user.id },
    include: { subject: true },
  })

  return NextResponse.json({
    subjects: weekdaySubjects.map((ws) => ws.subject),
    records,
    isHoliday: !!holiday,
    weekday,
  })
}
