"use client"

import type { UploadedFile } from "@/app/excel-uploads/page"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface HistoricalTabProps {
  files: UploadedFile[]
}

export function HistoricalTab({ files }: HistoricalTabProps) {
  // Group files by tank ID
  const filesByTank = files.reduce(
    (acc, file) => {
      const tankId = file.tankId || "Unknown"
      if (!acc[tankId]) acc[tankId] = []
      acc[tankId].push(file)
      return acc
    },
    {} as Record<string, UploadedFile[]>,
  )

  // Calculate average thickness per file
  const calculateAverageThickness = (data: Record<string, any>[] | undefined): number => {
    if (!data) return 0
    const thicknessValues = data.map((row) => row.thickness || row.Thickness || 0).filter((v) => typeof v === "number")
    return thicknessValues.length > 0 ? thicknessValues.reduce((a, b) => a + b, 0) / thicknessValues.length : 0
  }

  return (
    <div className="space-y-6">
      {Object.entries(filesByTank).map(([tankId, tankFiles]) => {
        if (tankFiles.length < 2) return null

        const historyData = tankFiles
          .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0))
          .map((file, idx) => ({
            date: file.timestamp?.toLocaleDateString() || `File ${idx + 1}`,
            thickness: calculateAverageThickness(file.data),
            file: file.name,
          }))

        return (
          <div key={tankId} className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Tank {tankId} - Corrosion Trend</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis
                  stroke="var(--muted-foreground)"
                  label={{ value: "Avg Thickness", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="thickness"
                  stroke="hsl(var(--chart-1))"
                  dot={{ fill: "hsl(var(--chart-1))" }}
                  name="Average Thickness"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">First Inspection</p>
                <p className="font-bold text-foreground">{historyData[0]?.thickness.toFixed(2)} mm</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Latest Inspection</p>
                <p className="font-bold text-foreground">
                  {historyData[historyData.length - 1]?.thickness.toFixed(2)} mm
                </p>
              </div>
            </div>
          </div>
        )
      })}

      {Object.values(filesByTank).every((files) => files.length < 2) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Upload multiple files for the same tank to see historical analysis</p>
        </div>
      )}
    </div>
  )
}
