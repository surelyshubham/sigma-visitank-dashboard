"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Good", value: 28 },
  { name: "Fair", value: 12 },
  { name: "Poor", value: 8 },
]

const COLORS = ["oklch(0.50 0.30 120)", "oklch(0.60 0.25 40)", "oklch(0.50 0.30 20)"]

export function TankConditionChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Tank Condition</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "oklch(0.12 0 0)", border: "1px solid oklch(0.20 0 0)" }}
            labelStyle={{ color: "oklch(0.95 0 0)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
