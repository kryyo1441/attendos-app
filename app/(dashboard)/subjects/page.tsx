"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, BookOpen, Loader2, Trash2, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubjectStat {
  id: string
  name: string
  type: "LECTURE" | "PRACTICAL" | "TUTORIAL"
  color: string
  attended: number
  conducted: number
  percentage: number
}

const SUBJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#64748b",
  "#a855f7",
]

export default function SubjectsPage() {
  const [stats, setStats] = useState<{ subjectStats: SubjectStat[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Create form state
  const [name, setName] = useState("")
  const [type, setType] = useState<"LECTURE" | "PRACTICAL" | "TUTORIAL">("LECTURE")
  const [color, setColor] = useState("#6366f1")

  // Edit form state
  const [editId, setEditId] = useState("")
  const [editName, setEditName] = useState("")
  const [editType, setEditType] = useState<"LECTURE" | "PRACTICAL" | "TUTORIAL">("LECTURE")
  const [editColor, setEditColor] = useState("#6366f1")

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/stats")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error("Failed to fetch stats", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    if (!name.trim()) return
    setCreating(true)
    try {
      await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), type, color }),
      })
      setName("")
      setType("LECTURE")
      setColor("#6366f1")
      setDialogOpen(false)
      await fetchData()
    } catch (err) {
      console.error("Failed to create subject", err)
    } finally {
      setCreating(false)
    }
  }

  const openEditDialog = (subject: SubjectStat) => {
    setEditId(subject.id)
    setEditName(subject.name)
    setEditType(subject.type)
    setEditColor(subject.color)
    setEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editName.trim()) return
    setUpdating(true)
    try {
      await fetch("/api/subjects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, name: editName.trim(), type: editType, color: editColor }),
      })
      setEditDialogOpen(false)
      await fetchData()
    } catch (err) {
      console.error("Failed to update subject", err)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    setDeleting(id)
    setDeleteConfirm(null)
    try {
      await fetch(`/api/subjects?id=${id}`, { method: "DELETE" })
      await fetchData()
    } catch (err) {
      console.error("Failed to delete subject", err)
    } finally {
      setDeleting(null)
    }
  }

  const getPercentageColor = (pct: number) => {
    if (pct < 50) return "bg-red-500"
    if (pct < 75) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getPercentageTextColor = (pct: number) => {
    if (pct < 50) return "text-red-500"
    if (pct < 75) return "text-amber-500"
    return "text-emerald-500"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const subjects = stats?.subjectStats ?? []

  return (
    <div className="min-h-screen">
      <Header
        title="Subjects"
        subtitle={`${subjects.length} subject${subjects.length !== 1 ? "s" : ""}`}
        actions={
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="rounded-xl"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">Add Subject</span>
          </Button>
        }
      />

      <main className="mx-auto max-w-2xl space-y-4 p-4 md:p-6">
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">
                No subjects created
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Create your first subject to start tracking attendance.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="mt-4 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Create Subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          subjects.map((subject) => (
            <Card
              key={subject.id}
              className="transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-1 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <Badge
                        variant={
                          subject.type === "LECTURE"
                            ? "lecture"
                            : subject.type === "PRACTICAL"
                            ? "practical"
                            : "tutorial"
                        }
                        className="mt-1"
                      >
                        {subject.type.charAt(0) + subject.type.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn("text-2xl font-bold mr-1", getPercentageTextColor(subject.percentage))}>
                      {Math.round(subject.percentage)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEditDialog(subject)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 transition-colors",
                        deleteConfirm === subject.id
                          ? "text-destructive bg-destructive/10"
                          : "text-muted-foreground hover:text-destructive"
                      )}
                      onClick={() => handleDelete(subject.id)}
                      disabled={deleting === subject.id}
                    >
                      {deleting === subject.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress
                    value={subject.percentage}
                    className="h-2"
                    indicatorClassName={getPercentageColor(subject.percentage)}
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{subject.attended} attended</span>
                    <span>{subject.conducted} conducted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>

      {/* Create Subject Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subject</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                {(["LECTURE", "PRACTICAL", "TUTORIAL"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200",
                      type === t
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-200 hover:scale-110",
                      color === c && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !name.trim()}
              className="rounded-xl"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Subject Name</Label>
              <Input
                id="editName"
                placeholder="e.g., Mathematics"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                {(["LECTURE", "PRACTICAL", "TUTORIAL"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setEditType(t)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200",
                      editType === t
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setEditColor(c)}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-200 hover:scale-110",
                      editColor === c && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating || !editName.trim()}
              className="rounded-xl"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
