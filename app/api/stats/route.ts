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

  // Get overall stats
  const records = await prisma.attendanceRecord.findMany({
    where: { userId: user.id },
    include: { subject: true },
  })

  const presentCount = records.filter((r) => r.status === "PRESENT").length
  const conductedCount = records.filter(
    (r) => r.status === "PRESENT" || r.status === "ABSENT"
  ).length

  const overallPercentage = conductedCount > 0 ? (presentCount / conductedCount) * 100 : 0

  // Per-subject stats
  const subjects = await prisma.subject.findMany({
    where: { userId: user.id },
  })

  const subjectStats = subjects.map((subject) => {
    const subjectRecords = records.filter((r) => r.subjectId === subject.id)
    const attended = subjectRecords.filter((r) => r.status === "PRESENT").length
    const conducted = subjectRecords.filter(
      (r) => r.status === "PRESENT" || r.status === "ABSENT"
    ).length
    const percentage = conducted > 0 ? (attended / conducted) * 100 : 0

    return {
      ...subject,
      attended,
      conducted,
      percentage,
    }
  })

  return NextResponse.json({
    overallPercentage,
    totalPresent: presentCount,
    totalConducted: conductedCount,
    subjectStats,
  })
}
