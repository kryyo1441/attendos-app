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
  const subjectId = searchParams.get("subjectId")
  const limit = searchParams.get("limit")

  const where: any = { userId: user.id }

  if (date) {
    where.date = new Date(date)
  }

  if (subjectId) {
    where.subjectId = subjectId
  }

  const records = await prisma.attendanceRecord.findMany({
    where,
    include: { subject: true },
    orderBy: { date: "desc" },
    ...(limit ? { take: parseInt(limit) } : {}),
  })

  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { date, subjectId, status } = body

  if (!date || !subjectId || !status) {
    return NextResponse.json({ error: "Date, subjectId, and status required" }, { status: 400 })
  }

  const record = await prisma.attendanceRecord.upsert({
    where: {
      date_subjectId_userId: {
        date: new Date(date),
        subjectId,
        userId: user.id,
      },
    },
    update: { status },
    create: {
      date: new Date(date),
      subjectId,
      status,
      userId: user.id,
    },
    include: { subject: true },
  })

  return NextResponse.json(record)
}
