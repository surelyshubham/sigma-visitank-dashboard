"use client"

import { Card } from "@/components/ui/card"

interface DataPreviewTableProps {
  data: Array<Record<string, any>>
}

export function DataPreviewTable({ data }: DataPreviewTableProps) {
  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No data found in this file</p>
      </Card>
    )
  }

  const columns = Object.keys(data[0])
  const previewData = data.slice(0, 20)

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left font-semibold text-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/50 transition">
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} className="px-4 py-3 text-muted-foreground">
                    {typeof row[col] === "number" ? row[col].toFixed(2) : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 20 && (
        <div className="px-4 py-3 bg-muted/50 text-sm text-muted-foreground">Showing 20 of {data.length} rows</div>
      )}
    </Card>
  )
}
