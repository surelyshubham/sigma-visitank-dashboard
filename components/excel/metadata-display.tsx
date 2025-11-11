"use client"

import { Card } from "@/components/ui/card"

interface MetadataDisplayProps {
  metadata: Record<string, any>
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  if (Object.keys(metadata).length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No metadata found in this file</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(metadata).map(([key, value]) => (
        <Card key={key} className="p-4">
          <p className="text-sm font-medium text-muted-foreground">{key}</p>
          <p className="text-lg font-semibold text-foreground mt-2 break-words">
            {typeof value === "object" ? JSON.stringify(value) : String(value)}
          </p>
        </Card>
      ))}
    </div>
  )
}
