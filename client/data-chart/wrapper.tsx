"use client"

import type React from "react"

interface ChartWrapperProps {
  content: React.ComponentType
  title?: string
  description?: string
  className?: string
}

export function ChartWrapper({ content: Chart, title, description, className }: ChartWrapperProps) {
  return (
    <div className={className}>
      <Chart />
    </div>
  )
}

