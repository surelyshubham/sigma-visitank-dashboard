"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useState } from "react"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download } from "lucide-react"

const trendData = [
  { period: "Jan 2023", condition: 95, defects: 2, corrosion: 0.5 },
  { period: "Apr 2023", condition: 88, defects: 5, corrosion: 1.2 },
  { period: "Jul 2023", condition: 80, defects: 8, corrosion: 2.1 },
  { period: "Oct 2023", condition: 72, defects: 12, corrosion: 3.4 },
  { period: "Jan 2024", condition: 68, defects: 15, corrosion: 4.8 },
  { period: "Apr 2024", condition: 62, defects: 19, corrosion: 6.2 },
  { period: "Jul 2024", condition: 58, defects: 21, corrosion: 7.5 },
  { period: "Nov 2024", condition: 55, defects: 24, corrosion: 8.9 },
]

export default function HistoricalAnalysisPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-foreground">Historical Analysis</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition">
                <Download size={18} />
                Export Summary
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Filter by Tank</label>
                <select className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground">
                  <option>All Tanks</option>
                  <option>Tank 1</option>
                  <option>Tank 3</option>
                  <option>Tank 5</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground"
                />
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              {/* Tank Condition Over Time */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Tank Condition Over Multiple Inspections</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorCondition" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.40 0.25 260)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="oklch(0.40 0.25 260)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0 0)" />
                    <XAxis dataKey="period" stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.12 0 0)", border: "1px solid oklch(0.20 0 0)" }}
                      labelStyle={{ color: "oklch(0.95 0 0)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="condition"
                      stroke="oklch(0.40 0.25 260)"
                      fillOpacity={1}
                      fill="url(#colorCondition)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Corrosion Rate Trend */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Corrosion Rate Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0 0)" />
                    <XAxis dataKey="period" stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.12 0 0)", border: "1px solid oklch(0.20 0 0)" }}
                      labelStyle={{ color: "oklch(0.95 0 0)" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="corrosion"
                      stroke="oklch(0.60 0.25 40)"
                      dot={{ fill: "oklch(0.60 0.25 40)" }}
                      strokeWidth={2}
                      name="Corrosion Rate (mm/year)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Defects Per Inspection */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Number of Defects Per Inspection Period</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0 0)" />
                    <XAxis dataKey="period" stroke="oklch(0.65 0 0)" />
                    <YAxis stroke="oklch(0.65 0 0)" />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.12 0 0)", border: "1px solid oklch(0.20 0 0)" }}
                      labelStyle={{ color: "oklch(0.95 0 0)" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="defects"
                      stroke="oklch(0.50 0.30 120)"
                      dot={{ fill: "oklch(0.50 0.30 120)" }}
                      strokeWidth={2}
                      name="Defects Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
