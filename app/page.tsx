"use client"

import { useEffect, useState } from "react"
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
  ArrowRight,
  Download,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Track Attendance",
    description: "Monitor your attendance percentage in real-time with beautiful visual indicators.",
    gradient: "from-green-500/20 to-transparent",
  },
  {
    icon: Calendar,
    title: "Manage Timetable",
    description: "Create and organize your weekly schedule with subjects and class timings.",
    gradient: "from-emerald-500/20 to-transparent",
  },
  {
    icon: BookOpen,
    title: "Subject Management",
    description: "Add subjects with custom types (Lecture, Practical, Tutorial) and color coding.",
    gradient: "from-teal-500/20 to-transparent",
  },
  {
    icon: TrendingUp,
    title: "Statistics & Analytics",
    description: "View detailed attendance statistics and subject-wise breakdowns.",
    gradient: "from-green-500/20 to-transparent",
  },
  {
    icon: Clock,
    title: "History Tracking",
    description: "Comprehensive attendance history with filtering and search capabilities.",
    gradient: "from-emerald-500/20 to-transparent",
  },
  {
    icon: Bell,
    title: "Holiday Management",
    description: "Mark and manage holidays in your attendance calendar.",
    gradient: "from-teal-500/20 to-transparent",
  },
]

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard")
    }
  }, [session, isPending, router])

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallApp = async () => {
    if (!installPrompt) return

    setIsInstalling(true)
    await installPrompt.prompt()
    await installPrompt.userChoice
    setIsInstalling(false)
    setInstallPrompt(null)
  }

  const canInstall = Boolean(installPrompt) && !isInstalled

  if (isPending) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
      
      <HeroNav />
      
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 lg:py-40 z-10">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Welcome to Attendance Excellence</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Never Miss Your{" "}
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Attendance Again
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-1 bg-linear-to-r from-primary to-emerald-500 blur-sm opacity-50" />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Attendos is your personal attendance tracker designed to help you stay on top of your class attendance, manage your timetable, and achieve your academic goals with ease.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="rounded-xl group bg-primary hover:bg-primary/90" 
                onClick={() => router.push("/register")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              {canInstall && (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-2 border-primary/30 bg-background/80 backdrop-blur hover:border-primary/60"
                  onClick={handleInstallApp}
                  disabled={isInstalling}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isInstalling ? "Opening..." : "Install App"}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-2 hover:border-primary/50"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20 md:py-28 z-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Powerful Features Built for You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed academically, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={feature.title} 
                  className="group relative border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative">
                    <div className="mb-4">
                      <div className="inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6 text-primary group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>

                  {/* Animated border accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 py-16 md:py-20 z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Accuracy</p>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Real-time</div>
              <p className="text-muted-foreground">Updates</p>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Easy</div>
              <p className="text-muted-foreground">to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 md:py-28 z-10">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-3xl border border-primary/20 bg-linear-to-br from-primary/5 to-emerald-500/5 p-8 md:p-12 overflow-hidden group">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start tracking your attendance and managing your academic life today. Join thousands of students already using Attendos.
              </p>
              <Button 
                size="lg" 
                className="rounded-xl group bg-primary hover:bg-primary/90"
                onClick={() => router.push("/register")}
              >
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-8 px-4 text-center text-sm text-muted-foreground z-10">
        <p>&copy; 2026 Attendos. Built with care for students.</p>
        {!canInstall && (
          <p className="mt-2 text-xs text-muted-foreground">
            On iPhone or unsupported browsers, use the browser menu and choose Add to Home Screen.
          </p>
        )}
      </footer>
    </div>
  )
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

