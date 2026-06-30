"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { HeroNav } from "@/components/hero-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  BookOpen,
  Bell,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Track Attendance",
    description: "Monitor your attendance percentage in real-time with beautiful visual indicators.",
  },
  {
    icon: Calendar,
    title: "Manage Timetable",
    description: "Create and organize your weekly schedule with subjects and class timings.",
  },
  {
    icon: BookOpen,
    title: "Subject Management",
    description: "Add subjects with custom types (Lecture, Practical, Tutorial) and color coding.",
  },
  {
    icon: TrendingUp,
    title: "Statistics & Analytics",
    description: "View detailed attendance statistics and subject-wise breakdowns.",
  },
  {
    icon: Clock,
    title: "History Tracking",
    description: "Comprehensive attendance history with filtering and search capabilities.",
  },
  {
    icon: Bell,
    title: "Holiday Management",
    description: "Mark and manage holidays in your attendance calendar.",
  },
]

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard")
    }
  }, [session, isPending, router])

  if (isPending) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <HeroNav />
      
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Never Miss Your{" "}
            <span className="bg-gradient-to-r from-primary via-green-500 to-primary bg-clip-text text-transparent">
              Attendance Again
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Attendos is your personal attendance tracker. Monitor your class attendance, manage
            your timetable, and achieve your academic goals with ease.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="rounded-xl" onClick={() => router.push("/register")}>
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you stay on top of your attendance and academic
              performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-primary/5 rounded-3xl mx-4 md:mx-auto max-w-6xl mb-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start tracking your attendance and managing your academic life today.
          </p>
          <Button size="lg" className="rounded-xl" onClick={() => router.push("/register")}>
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Attendos. Built with care for students.</p>
      </footer>
    </div>
  )
}

