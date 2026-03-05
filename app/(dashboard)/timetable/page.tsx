"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const

interface Subject {
  id: string
  name: string
  type: "LECTURE" | "PRACTICAL" | "TUTORIAL"
  color: string
}

interface WeekdaySubject {
  id: string
  weekday: string
  subjectId: string
  subject: Subject
}

export default function TimetablePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [weekdaySubjects, setWeekdaySubjects] = useState<WeekdaySubject[]>([])
  const [selectedDay, setSelectedDay] = useState<string>("MONDAY")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    try {
      const [subRes, ttRes] = await Promise.all([
        fetch("/api/subjects"),
        fetch("/api/timetable"),
      ])
      const subjectsData = await subRes.json()
      const timetableData = await ttRes.json()
      setSubjects(subjectsData)
      setWeekdaySubjects(timetableData)
    } catch (err) {
      console.error("Failed to fetch timetable data", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const daySubjects = weekdaySubjects
      .filter((ws) => ws.weekday === selectedDay)
      .map((ws) => ws.subjectId)
    setSelectedSubjects(new Set(daySubjects))
  }, [selectedDay, weekdaySubjects])

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev)
      if (next.has(subjectId)) {
        next.delete(subjectId)
      } else {
        next.add(subjectId)
      }
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekday: selectedDay,
          subjectIds: Array.from(selectedSubjects),
        }),
      })
      await fetchData()
    } catch (err) {
      console.error("Failed to save timetable", err)
    } finally {
      setSaving(false)
    }
  }

  const getDaySubjectCount = (day: string) => {
    return weekdaySubjects.filter((ws) => ws.weekday === day).length
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
      <Header title="Timetable" subtitle="Weekly schedule planner" />

      <main className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
        {/* Weekday selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {WEEKDAYS.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDay(day)}
              className="shrink-0 rounded-xl"
            >
              <span className="hidden sm:inline">
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </span>
              <span className="sm:hidden">
                {day.slice(0, 3)}
              </span>
              {getDaySubjectCount(day) > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 w-5 justify-center p-0 text-[10px]">
                  {getDaySubjectCount(day)}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Subject selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              {selectedDay.charAt(0) + selectedDay.slice(1).toLowerCase()} — Select Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No subjects created yet.</p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Go to Subjects to create your first subject.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {subjects.map((subject) => {
                  const isSelected = selectedSubjects.has(subject.id)
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:scale-[1.01]",
                        isSelected
                          ? "border-primary/30 bg-primary/5 shadow-sm"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div
                        className="h-8 w-1 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{subject.name}</p>
                        <Badge
                          variant={
                            subject.type === "LECTURE"
                              ? "lecture"
                              : subject.type === "PRACTICAL"
                              ? "practical"
                              : "tutorial"
                          }
                          className="mt-0.5"
                        >
                          {subject.type.charAt(0) + subject.type.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {subjects.length > 0 && (
              <Button
                className="mt-4 w-full rounded-xl"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save Schedule
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Overview of the week */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {WEEKDAYS.map((day) => {
                const daySubjects = weekdaySubjects
                  .filter((ws) => ws.weekday === day)
                  .map((ws) => ws.subject)
                return (
                  <div key={day} className="flex items-start gap-3">
                    <span className="w-20 shrink-0 text-sm font-medium text-muted-foreground">
                      {day.slice(0, 3)}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {daySubjects.length === 0 ? (
                        <span className="text-sm text-muted-foreground/50">—</span>
                      ) : (
                        daySubjects.map((subject) => (
                          <Badge
                            key={subject.id}
                            variant="secondary"
                            className="text-xs"
                            style={{
                              borderColor: subject.color + "40",
                              backgroundColor: subject.color + "15",
                            }}
                          >
                            {subject.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
