"use client"

import { useRouter } from "next/navigation"
import { Github, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function HeroNav() {
  const router = useRouter()

  return (
    <nav className="glass sticky top-0 z-50 h-16 border-b border-border/50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:shadow-lg transition-shadow">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">Attendos</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-xl" asChild>
          <a
            href="https://github.com/kryyo1441/attendos-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          className="rounded-xl"
          onClick={() => router.push("/login")}
        >
          Sign In
        </Button>
        <Button
          className="rounded-xl"
          onClick={() => router.push("/register")}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  )
}
