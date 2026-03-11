"use client"

import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({
  value,
  size = 160,
  strokeWidth = 12,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const getColor = (val: number) => {
    if (val < 50) return "text-red-500"
    if (val < 75) return "text-amber-500"
    return "text-emerald-500"
  }

  const getTrackColor = (val: number) => {
    if (val < 50) return "text-red-100 dark:text-red-950"
    if (val < 75) return "text-amber-100 dark:text-amber-950"
    return "text-emerald-100 dark:text-emerald-950"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={cn("stroke-current", getTrackColor(value))}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={cn("stroke-current transition-all duration-700 ease-in-out", getColor(value))}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-3xl font-bold", getColor(value))}>
          {Math.round(value)}%
        </span>
        <span className="text-xs text-muted-foreground">Attendance</span>
      </div>
    </div>
  )
}
