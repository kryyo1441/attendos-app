"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Check,
  X,
  MinusCircle,
  Loader2,
  History as HistoryIcon,
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
  createdAt: string
}

const statusConfig = {
  PRESENT: {
    label: "Present",
    icon: Check,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900",
  },
  ABSENT: {
    label: "Absent",
    icon: X,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900",
  },
  NO_LECTURE: {
    label: "No Lecture",
    icon: MinusCircle,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-muted",
  },
}

export default function HistoryPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filterSubject, setFilterSubject] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [recRes, subRes] = await Promise.all([
        fetch("/api/attendance"),
        fetch("/api/subjects"),
      ])
      const recordsData = await recRes.json()
      const subjectsData = await subRes.json()
      setRecords(recordsData)
      setSubjects(subjectsData)
    } catch (err) {
      console.error("Failed to fetch history data", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredRecords =
    filterSubject === "all"
      ? records
      : records.filter((r) => r.subjectId === filterSubject)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Group records by date
  const groupedRecords = filteredRecords.reduce<
    Record<string, AttendanceRecord[]>
  >((acc, record) => {
    const date = record.date.split("T")[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(record)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedRecords).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

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
        title="History"
        subtitle={`${filteredRecords.length} record${filteredRecords.length !== 1 ? "s" : ""}`}
      />

      <main className="mx-auto max-w-2xl space-y-4 p-4 md:p-6">
        {/* Filter */}
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Records */}
        {sortedDates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <HistoryIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">
                No attendance records
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Start marking attendance on the dashboard.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                {formatDate(date)}
              </p>
              <div className="space-y-2">
                {groupedRecords[date].map((record) => {
                  const config = statusConfig[record.status]
                  const StatusIcon = config.icon
                  return (
                    <Card
                      key={record.id}
                      className={cn(
                        "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                        config.border
                      )}
                    >
                      <CardContent className="flex items-center gap-3 py-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            config.bg
                          )}
                        >
                          <StatusIcon className={cn("h-4 w-4", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">
                            {record.subject.name}
                          </p>
                          <Badge
                            variant={
                              record.subject.type === "LECTURE"
                                ? "lecture"
                                : record.subject.type === "PRACTICAL"
                                ? "practical"
                                : "tutorial"
                            }
                            className="mt-0.5"
                          >
                            {record.subject.type.charAt(0) +
                              record.subject.type.slice(1).toLowerCase()}
                          </Badge>
                        </div>
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
                            record.status === "PRESENT" &&
                              "bg-emerald-500 text-white"
                          )}
                        >
                          {config.label}
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
