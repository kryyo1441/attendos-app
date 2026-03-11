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

  const holidays = await prisma.holiday.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(holidays)
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { date } = body

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 })
  }

  const dateObj = new Date(date)

  // Check if already a holiday
  const existing = await prisma.holiday.findFirst({
    where: { date: dateObj, userId: user.id },
  })

  if (existing) {
    // Remove holiday
    await prisma.holiday.delete({ where: { id: existing.id } })

    // Remove all NO_LECTURE records for this date that were auto-set
    await prisma.attendanceRecord.deleteMany({
      where: { date: dateObj, userId: user.id, status: "NO_LECTURE" },
    })

    return NextResponse.json({ holiday: false })
  }

  // Create holiday
  const holiday = await prisma.holiday.create({
    data: { date: dateObj, userId: user.id },
  })

  // Set all subjects for this date to NO_LECTURE
  const weekday = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][dateObj.getDay()]
  
  const weekdaySubjects = await prisma.weekdaySubject.findMany({
    where: { weekday: weekday as any, userId: user.id },
  })

  for (const ws of weekdaySubjects) {
    await prisma.attendanceRecord.upsert({
      where: {
        date_subjectId_userId: {
          date: dateObj,
          subjectId: ws.subjectId,
          userId: user.id,
        },
      },
      update: { status: "NO_LECTURE" },
      create: {
        date: dateObj,
        subjectId: ws.subjectId,
        status: "NO_LECTURE",
        userId: user.id,
      },
    })
  }

  return NextResponse.json({ holiday: true, data: holiday })
}
