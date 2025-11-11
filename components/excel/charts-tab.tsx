"use client"

import type { UploadedFile } from "@/app/excel-uploads/page"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download } from "lucide-react"

interface ChartsTabProps {
  files: UploadedFile[]
}

export function ChartsTab({ files }: ChartsTabProps) {
  const getNumericColumns = (data: Record<string, any>[] | undefined, headers: string[] | undefined): string[] => {
    if (!data || !headers) return []

    return headers.filter((header) => {
      return data.some((row) => typeof row[header] === "number")
    })
  }

  const downloadChartImage = (chartName: string) => {
    // Placeholder for chart download functionality
    console.log("Download chart:", chartName)
  }

  return (
    <div className="space-y-6">
      {files.map((file) => {
        const numericCols = getNumericColumns(file.data, file.headers)
        const hasCoordinates = file.headers?.some((h) => /^(x|y|z|distance|index)$/i.test(h))
        const hasThickness = file.headers?.some((h) => /thickness/i.test(h))
        const hasTemperature = file.headers?.some((h) => /temp/i.test(h))

        return (
          <div key={file.id} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">{file.name}</h3>

            {/* Line Chart */}
            {numericCols.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Thickness Progression</h4>
                  <button
                    onClick={() => downloadChartImage("line-chart")}
                    className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition"
                  >
                    <Download size={16} />
                    Download PNG
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={file.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey={file.headers?.[0]} stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip />
                    <Legend />
                    {numericCols.slice(0, 3).map((col, idx) => (
                      <Line
                        key={col}
                        type="monotone"
                        dataKey={col}
                        stroke={`hsl(var(--chart-${(idx % 5) + 1}))`}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Bar Chart */}
            {numericCols.length > 1 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Section-wise Averages</h4>
                  <button
                    onClick={() => downloadChartImage("bar-chart")}
                    className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition"
                  >
                    <Download size={16} />
                    Download PNG
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={file.data?.slice(0, 15)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey={file.headers?.[0]} stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip />
                    <Legend />
                    {numericCols.slice(0, 2).map((col, idx) => (
                      <Bar key={col} dataKey={col} fill={`hsl(var(--chart-${(idx % 5) + 1}))`} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Scatter Plot */}
            {hasThickness && hasTemperature && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Thickness vs Temperature</h4>
                  <button
                    onClick={() => downloadChartImage("scatter-chart")}
                    className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition"
                  >
                    <Download size={16} />
                    Download PNG
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={file.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" dataKey="temperature" stroke="var(--muted-foreground)" name="Temperature" />
                    <YAxis type="number" dataKey="thickness" stroke="var(--muted-foreground)" name="Thickness" />
                    <Tooltip />
                    <Scatter name="Measurements" data={file.data} fill="hsl(var(--chart-1))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
