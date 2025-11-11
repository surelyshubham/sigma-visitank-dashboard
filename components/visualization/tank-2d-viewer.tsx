"use client"

import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { getThicknessColor, thicknessScale } from "./color-mapper"

interface Tank2DViewerProps {
  data: Record<string, any>[]
  headers: string[]
  productType: "tank" | "pipe" | "elbow" | "vessel"
}

export function Tank2DViewer({ data, headers, productType }: Tank2DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)

  // Detect coordinate columns
  const xCol = headers.find((h) => h.toLowerCase().includes("x"))
  const yCol = headers.find((h) => h.toLowerCase().includes("y"))
  const thicknessCol = headers.find((h) => h.toLowerCase().includes("thickness") || h.toLowerCase().includes("depth"))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    // Find data range
    const xValues = data.map((d) => (xCol ? d[xCol] : 0)).filter((v) => typeof v === "number")
    const yValues = data.map((d) => (yCol ? d[yCol] : 0)).filter((v) => typeof v === "number")
    const thicknessValues = data.map((d) => (thicknessCol ? d[thicknessCol] : 0)).filter((v) => typeof v === "number")

    if (xValues.length === 0 || yValues.length === 0) {
      ctx.fillStyle = "#666"
      ctx.font = "14px sans-serif"
      ctx.fillText("No valid data to display", width / 2 - 100, height / 2)
      return
    }

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)
    const thicknessMax = Math.max(...thicknessValues, 100)
    const thicknessMin = Math.min(...thicknessValues, 0)

    const padding = 60
    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding

    // Draw grid
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * graphWidth
      const y = padding + (i / 10) * graphHeight
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + graphHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + graphWidth, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw zero point marker
    const zeroPx = padding + ((0 - xMin) / (xMax - xMin)) * graphWidth
    const zeroPy = height - padding - ((0 - yMin) / (yMax - yMin)) * graphHeight
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(zeroPx, zeroPy, 6, 0, Math.PI * 2)
    ctx.fill()

    // Plot data points
    data.forEach((point, idx) => {
      const x = xCol ? point[xCol] : 0
      const y = yCol ? point[yCol] : 0
      const thickness = thicknessCol ? point[thicknessCol] : 50

      if (typeof x === "number" && typeof y === "number") {
        const px = padding + ((x - xMin) / (xMax - xMin)) * graphWidth
        const py = height - padding - ((y - yMin) / (yMax - yMin)) * graphHeight

        const color = getThicknessColor(thickness, thicknessMax)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(px * zoom + pan.x, py * zoom + pan.y, 6, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })

    // Draw compass
    const compassSize = 40
    const compassX = width - 70
    const compassY = 50
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassSize, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = "#000"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("N", compassX, compassY - compassSize + 8)
    ctx.fillText("S", compassX, compassY + compassSize - 8)
    ctx.fillText("E", compassX + compassSize - 8, compassY)
    ctx.fillText("W", compassX - compassSize + 8, compassY)

    // Draw legend
    let legendY = 20
    Object.entries(thicknessScale).forEach(([key, scale]) => {
      ctx.fillStyle = scale.color
      ctx.fillRect(10, legendY, 16, 16)
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(scale.label, 32, legendY + 12)
      legendY += 20
    })
  }, [data, headers, productType, zoom, pan])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
          className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => {
            setZoom(1)
            setPan({ x: 0, y: 0 })
          }}
          className="p-2 bg-secondary text-secondary-foreground rounded hover:opacity-90"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <span className="text-sm text-muted-foreground ml-auto">Zoom: {zoom.toFixed(1)}x</span>
      </div>
      <canvas ref={canvasRef} width={800} height={600} className="border border-border rounded-lg bg-white" />
      {hoveredPoint && (
        <div className="p-4 bg-card border border-border rounded text-sm">
          <p>
            X: {hoveredPoint.x}, Y: {hoveredPoint.y}, Thickness: {hoveredPoint.thickness}
          </p>
        </div>
      )}
    </div>
  )
}
