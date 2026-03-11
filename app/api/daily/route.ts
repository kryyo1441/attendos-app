import { NextRequest, NextResponse } from "next/server"
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
  const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  const weekday = weekdays[dateObj.getDay()]

  // Get subjects for this weekday
  const weekdaySubjects = await prisma.weekdaySubject.findMany({
    where: { weekday: weekday as any, userId: user.id },
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
