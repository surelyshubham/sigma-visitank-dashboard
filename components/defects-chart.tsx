"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Jan", defects: 4 },
  { date: "Feb", defects: 6 },
  { date: "Mar", defects: 5 },
  { date: "Apr", defects: 9 },
  { date: "May", defects: 7 },
  { date: "Jun", defects: 8 },
  { date: "Jul", defects: 12 },
]

export function DefectsChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Defects Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0 0)" />
          <XAxis dataKey="date" stroke="oklch(0.65 0 0)" />
          <YAxis stroke="oklch(0.65 0 0)" />
          <Tooltip
            contentStyle={{ background: "oklch(0.12 0 0)", border: "1px solid oklch(0.20 0 0)" }}
            labelStyle={{ color: "oklch(0.95 0 0)" }}
          />
          <Line
            type="monotone"
            dataKey="defects"
            stroke="oklch(0.50 0.30 120)"
            dot={{ fill: "oklch(0.50 0.30 120)" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
