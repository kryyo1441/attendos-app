"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { CircularProgress } from "@/components/circular-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  X,
  MinusCircle,
  CalendarOff,
  Calendar,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Subject {
  id: string
  name: string
  type: "LECTURE" | "PRACTICAL" | "TUTORIAL"
  color: string
}

interface AttendanceRecord {
  id: string
  date: string
  subjectId: string
  status: "PRESENT" | "ABSENT" | "NO_LECTURE"
  subject: Subject
}

interface DailyData {
  subjects: Subject[]
  records: AttendanceRecord[]
  isHoliday: boolean
  weekday: string
}

interface StatsData {
  overallPercentage: number
  totalPresent: number
  totalConducted: number
}

function getDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getTypeBadgeVariant(type: string): "lecture" | "practical" | "tutorial" {
  switch (type) {
    case "PRACTICAL":
    case "TUTORIAL":
      return type.toLowerCase() as "practical" | "tutorial"
    default:
      return "lecture"
  }
}

export default function DashboardPage() {
  const [dailyData, setDailyData] = useState<DailyData | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [holidayLoading, setHolidayLoading] = useState(false)

  const today = new Date()
  const dateStr = getDateString(today)

  const fetchData = useCallback(async () => {
    try {
      const [dailyRes, statsRes] = await Promise.all([
        fetch(`/api/daily?date=${dateStr}`),
        fetch("/api/stats"),
      ])
      const dailyJson = await dailyRes.json()
      const statsJson = await statsRes.json()
      setDailyData(dailyJson)
      setStats(statsJson)
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }, [dateStr])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAttendance = async (subjectId: string, status: string) => {
    setActionLoading(subjectId + status)
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, subjectId, status }),
      })
      await fetchData()
    } catch (err) {
      console.error("Failed to mark attendance", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleHoliday = async () => {
    setHolidayLoading(true)
    try {
      await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr }),
      })
      await fetchData()
    } catch (err) {
      console.error("Failed to toggle holiday", err)
    } finally {
      setHolidayLoading(false)
    }
  }

  const getRecordForSubject = (subjectId: string) => {
    return dailyData?.records.find((r) => r.subjectId === subjectId)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle={formatDate(today)}
        actions={
          <Button
            variant={dailyData?.isHoliday ? "destructive" : "outline"}
            size="sm"
            onClick={handleHoliday}
            disabled={holidayLoading}
            className="rounded-xl"
          >
            {holidayLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : dailyData?.isHoliday ? (
              <CalendarOff className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
            <span className="ml-1.5 hidden sm:inline">
              {dailyData?.isHoliday ? "Remove Holiday" : "Mark Holiday"}
            </span>
          </Button>
        }
      />

      <main className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
        {/* Overall Attendance Card */}
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center py-8">
            <CircularProgress value={stats?.overallPercentage ?? 0} size={180} strokeWidth={14} />
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{stats?.totalPresent ?? 0} attended</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{stats?.totalConducted ?? 0} conducted</span>
            </div>
          </CardContent>
        </Card>

        {/* Holiday banner */}
        {dailyData?.isHoliday && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
            <CardContent className="flex items-center gap-3 py-4">
              <CalendarOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Holiday
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No attendance is being counted today.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Cards */}
        {!dailyData?.subjects || dailyData.subjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">
                No lectures scheduled
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Set up your timetable to see today&apos;s subjects.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dailyData.subjects.map((subject) => {
              const record = getRecordForSubject(subject.id)
              const isDisabled = dailyData.isHoliday

              return (
                <Card
                  key={subject.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                    record?.status === "PRESENT" && "border-emerald-200 dark:border-emerald-900",
                    record?.status === "ABSENT" && "border-red-200 dark:border-red-900",
                    record?.status === "NO_LECTURE" && "border-muted opacity-60"
                  )}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-1 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <Badge variant={getTypeBadgeVariant(subject.type)} className="mt-1">
                            {subject.type.charAt(0) + subject.type.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </div>

                      {record && (
                        <Badge
                          variant={
                            record.status === "PRESENT"
                              ? "default"
                              : record.status === "ABSENT"
                              ? "destructive"
                              : "secondary"
                          }
                          className={cn(
                            "shrink-0",
                            record.status === "PRESENT" && "bg-emerald-500 text-white"
                          )}
                        >
                          {record.status === "PRESENT"
                            ? "Present"
                            : record.status === "ABSENT"
                            ? "Absent"
                            : "No Lecture"}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant={record?.status === "PRESENT" ? "success" : "outline"}
                        className="flex-1 rounded-xl"
                        onClick={() => handleAttendance(subject.id, "PRESENT")}
                        disabled={isDisabled || actionLoading === subject.id + "PRESENT"}
                      >
                        {actionLoading === subject.id + "PRESENT" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={record?.status === "ABSENT" ? "danger" : "outline"}
                        className="flex-1 rounded-xl"
                        onClick={() => handleAttendance(subject.id, "ABSENT")}
                        disabled={isDisabled || actionLoading === subject.id + "ABSENT"}
                      >
                        {actionLoading === subject.id + "ABSENT" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={record?.status === "NO_LECTURE" ? "secondary" : "outline"}
                        className="flex-1 rounded-xl"
                        onClick={() => handleAttendance(subject.id, "NO_LECTURE")}
                        disabled={isDisabled || actionLoading === subject.id + "NO_LECTURE"}
                      >
                        {actionLoading === subject.id + "NO_LECTURE" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MinusCircle className="h-4 w-4" />
                        )}
                        No Lecture
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
