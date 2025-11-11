"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ExcelData {
  id: string
  filename: string
  uploadTime: Date
  metadata: Record<string, any>
  data: Array<Record<string, any>>
  type: "metadata" | "scan-data" | "mixed"
}

interface HistoricalComparisonProps {
  uploads: ExcelData[]
}

export function HistoricalComparison({ uploads }: HistoricalComparisonProps) {
  const [showComparison, setShowComparison] = useState(false)

  if (uploads.length < 2) {
    return null
  }

  // Group uploads by tank ID (from metadata or filename)
  const groupedByTank = uploads.reduce(
    (acc, upload) => {
      const tankId = upload.metadata?.["Tank ID"] || upload.metadata?.["Job"] || "unknown"
      if (!acc[tankId]) acc[tankId] = []
      acc[tankId].push(upload)
      return acc
    },
    {} as Record<string, ExcelData[]>,
  )

  // Prepare comparison data
  const comparisonData = Object.entries(groupedByTank)
    .filter(([_, tankUploads]) => tankUploads.length > 1)
    .flatMap(([tankId, tankUploads]) => {
      return tankUploads.map((upload) => {
        const avgThickness =
          upload.data.length > 0
            ? upload.data.reduce((sum, row) => {
                const thickness = Object.values(row).find((v) => typeof v === "number")
                return sum + (thickness || 0)
              }, 0) / upload.data.length
            : 0

        return {
          date: upload.uploadTime.toLocaleDateString(),
          tankId,
          avgThickness: Number.parseFloat(avgThickness.toFixed(2)),
          uploadId: upload.id,
        }
      })
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (comparisonData.length === 0) {
    return null
  }

  return (
    <>
      <Button variant="outline" onClick={() => setShowComparison(!showComparison)}>
        Historical Comparison
      </Button>

      {showComparison && (
        <Card className="mt-4 p-6">
          <h3 className="font-semibold text-foreground mb-4">Thickness Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Line type="monotone" dataKey="avgThickness" stroke="var(--primary)" name="Avg Thickness (mm)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </>
  )
}
