"use client"

import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface ChartsVisualizationProps {
  data: Array<Record<string, any>>
  metadata: Record<string, any>
}

export function ChartsVisualization({ data, metadata }: ChartsVisualizationProps) {
  const [chartColumns, setChartColumns] = useState<string[]>([])

  useEffect(() => {
    if (data.length === 0) return

    const columns = Object.keys(data[0])
    console.log("[v0] Chart columns detected:", columns, "Sample row:", data[0])

    // Filter for numeric columns
    const numeric = columns.filter((col) => {
      return data.some((row) => {
        const val = row[col]
        return typeof val === "number" || (typeof val === "string" && !isNaN(Number.parseFloat(val)))
      })
    })

    setChartColumns(numeric)
  }, [data])

  if (data.length === 0 || chartColumns.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No numeric data available for visualization</p>
      </Card>
    )
  }

  const chartData = data.slice(0, 200).map((row) => {
    const converted: Record<string, any> = {}
    for (const col of chartColumns) {
      const val = row[col]
      converted[col] = typeof val === "number" ? val : Number.parseFloat(val)
    }
    return converted
  })

  return (
    <div className="space-y-6">
      {chartColumns.length >= 2 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {chartColumns[0]} vs {chartColumns[1]}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={chartColumns[0]} stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Line type="monotone" dataKey={chartColumns[1]} stroke="#3b82f6" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {chartColumns.length >= 3 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Scatter: {chartColumns[0]} vs {chartColumns[1]} vs {chartColumns[2]}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={chartColumns[0]} type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey={chartColumns[1]} type="number" stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Scatter dataKey={chartColumns[2]} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      )}

      {chartColumns.length >= 4 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {chartColumns[2]} vs {chartColumns[3]}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={chartColumns[2]} stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Line type="monotone" dataKey={chartColumns[3]} stroke="#f59e0b" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
