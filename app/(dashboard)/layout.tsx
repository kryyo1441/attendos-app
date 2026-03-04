"use client"

import { Sidebar, SidebarProvider, useSidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        collapsed ? "md:pl-[68px]" : "md:pl-64"
      )}
    >
      {children}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) return null

  return (
    <SidebarProvider>
      <Sidebar />
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
