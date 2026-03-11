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

  const subjects = await prisma.subject.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(subjects)
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, type, color } = body

  if (!name || !type) {
    return NextResponse.json({ error: "Name and type are required" }, { status: 400 })
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      type,
      color: color || "#6366f1",
      userId: user.id,
    },
  })

  return NextResponse.json(subject)
}

export async function PUT(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { id, name, type, color } = body

  if (!id) return NextResponse.json({ error: "Subject ID required" }, { status: 400 })
  if (!name || !type) return NextResponse.json({ error: "Name and type are required" }, { status: 400 })

  const subject = await prisma.subject.update({
    where: { id, userId: user.id },
    data: { name, type, color },
  })

  return NextResponse.json(subject)
}

export async function DELETE(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ error: "Subject ID required" }, { status: 400 })

  // Delete related records first
  await prisma.attendanceRecord.deleteMany({
    where: { subjectId: id, userId: user.id },
  })
  await prisma.weekdaySubject.deleteMany({
    where: { subjectId: id, userId: user.id },
  })
  await prisma.subject.delete({
    where: { id, userId: user.id },
  })

  return NextResponse.json({ success: true })
}
