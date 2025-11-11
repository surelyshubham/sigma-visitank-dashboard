"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, TrendingDown } from "lucide-react"
import { generateMockHistoricalData } from "@/lib/mock-historical-data"

export default function HistoricalAnalysisPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/")
  }

  const historicalData = generateMockHistoricalData()

  const thicknessTrendData = historicalData.map((record) => ({
    date: record.date,
    average: record.averageThickness,
    minimum: record.minThickness,
    maximum: record.maxThickness,
  }))

  const sectionComparisonData = historicalData.map((record) => ({
    date: record.date,
    shell: record.sections.shell,
    roof: record.sections.roof,
    bottom: record.sections.bottom,
  }))

  const defectCorrosionData = historicalData.map((record) => ({
    date: record.date,
    defects: record.defectCount,
    corrosion: record.corrosionRate,
  }))

  const handleExportCSV = () => {
    let csv = "Date,Average Thickness,Min Thickness,Max Thickness,Defects,Corrosion Rate\n"
    historicalData.forEach((record) => {
      csv += `${record.date},${record.averageThickness},${record.minThickness},${record.maxThickness},${record.defectCount},${record.corrosionRate}\n`
    })
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "historical-analysis.csv"
    a.click()
  }

  const handleExportImage = () => {
    alert("Image export would save all charts as PNG. Implement using html2canvas library.")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Historical Analysis</h1>
                <p className="text-muted-foreground mt-1">Track inspection trends and corrosion rates over time</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition font-medium"
                >
                  <Download size={18} />
                  Export CSV
                </button>
                <button
                  onClick={handleExportImage}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:opacity-90 text-secondary-foreground rounded-lg transition font-medium"
                >
                  <Download size={18} />
                  Export Image
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-bold text-foreground mb-4">Filters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Product Type</label>
                  <select className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground">
                    <option>All Products</option>
                    <option>Tank</option>
                    <option>Pipe</option>
                    <option>Elbow</option>
                    <option>Vessel</option>
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
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Current Average Thickness",
                  value: historicalData[historicalData.length - 1]?.averageThickness.toFixed(2),
                  unit: "mm",
                },
                {
                  label: "Total Corrosion Rate",
                  value: historicalData[historicalData.length - 1]?.corrosionRate.toFixed(2),
                  unit: "mm/year",
                },
                {
                  label: "Active Defects",
                  value: historicalData[historicalData.length - 1]?.defectCount,
                  unit: "defects",
                },
                {
                  label: "Degradation Trend",
                  value: (
                    historicalData[0].averageThickness - historicalData[historicalData.length - 1].averageThickness
                  ).toFixed(2),
                  unit: "mm loss",
                  icon: true,
                },
              ].map((stat, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.unit}</p>
                    {stat.icon && <TrendingDown size={20} className="text-destructive" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Thickness Trend Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Thickness Trend Over Time</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Average, minimum, and maximum thickness across inspections
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={thicknessTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                  <XAxis dataKey="date" stroke="oklch(0.5 0 0)" />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    label={{ value: "Thickness (mm)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip contentStyle={{ background: "oklch(0.98 0 0)", border: "1px solid oklch(0.92 0 0)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="average" stroke="oklch(0.5 0.22 260)" strokeWidth={2} name="Average" />
                  <Line type="monotone" dataKey="minimum" stroke="oklch(0.62 0.25 30)" strokeWidth={2} name="Minimum" />
                  <Line
                    type="monotone"
                    dataKey="maximum"
                    stroke="oklch(0.52 0.25 120)"
                    strokeWidth={2}
                    name="Maximum"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Section-wise Comparison */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Section-Wise Thickness Comparison</h2>
              <p className="text-sm text-muted-foreground mb-4">Track thickness changes in different tank sections</p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sectionComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                  <XAxis dataKey="date" stroke="oklch(0.5 0 0)" />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    label={{ value: "Thickness (mm)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip contentStyle={{ background: "oklch(0.98 0 0)", border: "1px solid oklch(0.92 0 0)" }} />
                  <Legend />
                  <Bar dataKey="shell" stackId="a" fill="oklch(0.5 0.22 260)" name="Shell" />
                  <Bar dataKey="roof" stackId="a" fill="oklch(0.52 0.25 120)" name="Roof" />
                  <Bar dataKey="bottom" stackId="a" fill="oklch(0.6 0.25 40)" name="Bottom" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Defects and Corrosion Rate */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Defects and Corrosion Rate Progression</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={defectCorrosionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                  <XAxis dataKey="date" stroke="oklch(0.5 0 0)" />
                  <YAxis
                    yAxisId="left"
                    stroke="oklch(0.5 0 0)"
                    label={{ value: "Defect Count", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="oklch(0.5 0 0)"
                    label={{ value: "Corrosion (mm/yr)", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip contentStyle={{ background: "oklch(0.98 0 0)", border: "1px solid oklch(0.92 0 0)" }} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="defects"
                    stroke="oklch(0.62 0.25 30)"
                    strokeWidth={2}
                    name="Defects"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="corrosion"
                    stroke="oklch(0.6 0.25 40)"
                    strokeWidth={2}
                    name="Corrosion Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
