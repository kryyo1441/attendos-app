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

  const weekdaySubjects = await prisma.weekdaySubject.findMany({
    where: { userId: user.id },
    include: { subject: true },
    orderBy: { subject: { name: "asc" } },
  })

  return NextResponse.json(weekdaySubjects)
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { weekday, subjectIds } = body as { weekday: string; subjectIds: string[] }

  if (!weekday || !subjectIds) {
    return NextResponse.json({ error: "Weekday and subjectIds required" }, { status: 400 })
  }

  // Delete existing entries for this weekday
  await prisma.weekdaySubject.deleteMany({
    where: { weekday: weekday as any, userId: user.id },
  })

  // Create new entries
  if (subjectIds.length > 0) {
    await prisma.weekdaySubject.createMany({
      data: subjectIds.map((subjectId: string) => ({
        weekday: weekday as any,
        subjectId,
        userId: user.id,
      })),
    })
  }

  const updated = await prisma.weekdaySubject.findMany({
    where: { weekday: weekday as any, userId: user.id },
    include: { subject: true },
  })

  return NextResponse.json(updated)
}
