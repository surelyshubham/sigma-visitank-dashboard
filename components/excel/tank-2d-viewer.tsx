"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

interface Tank2DViewerProps {
  data: Array<Record<string, any>>
  metadata: Record<string, any>
  viewType: "top" | "side"
}

export function Tank2DViewer({ data, metadata, viewType }: Tank2DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [columnInfo, setColumnInfo] = useState<{ xCol: string; yCol: string; colorCol: string }>({
    xCol: "",
    yCol: "",
    colorCol: "",
  })
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)

  useEffect(() => {
    if (data.length === 0) return

    const keys = Object.keys(data[0])

    // Find appropriate columns based on view type
    const findColumn = (keywords: string[]) => {
      return keys.find((k) => keywords.some((keyword) => k.toLowerCase().includes(keyword))) || keys[0]
    }

    let xCol, yCol
    if (viewType === "top") {
      xCol = findColumn(["x", "x-coordinate", "x_coord", "position-x", "positionx"])
      yCol = findColumn(["y", "y-coordinate", "y_coord", "position-y", "positiony"])
    } else {
      xCol = findColumn(["x", "x-coordinate", "x_coord", "position-x", "positionx"])
      yCol = findColumn(["z", "z-coordinate", "z_coord", "height", "elevation"])
    }

    const colorCol = findColumn(["thickness", "depth", "corrosion", "metal", "wall", "reading"])

    setColumnInfo({ xCol, yCol, colorCol })
  }, [data, viewType])

  useEffect(() => {
    if (!canvasRef.current || data.length === 0 || !columnInfo.xCol) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    const { xCol, yCol, colorCol } = columnInfo

    // Extract numeric values
    const getNumericValues = (col: string) => {
      return data.map((d) => {
        const val = d[col]
        const num = typeof val === "number" ? val : Number.parseFloat(val)
        return isNaN(num) ? 0 : num
      })
    }

    const xValues = getNumericValues(xCol)
    const yValues = getNumericValues(yCol)
    const colorValues = getNumericValues(colorCol)

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)
    const colorMin = Math.min(...colorValues)
    const colorMax = Math.max(...colorValues)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 60

    // Draw grid
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding)
      const y = padding + (i / 10) * (height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw data points
    data.forEach((point, idx) => {
      const x = xValues[idx]
      const y = yValues[idx]
      const color = colorValues[idx]

      const px = padding + ((x - xMin) / (xMax - xMin || 1)) * (width - 2 * padding)
      const py = height - padding - ((y - yMin) / (yMax - yMin || 1)) * (height - 2 * padding)

      // Color gradient: green (high/good) to red (low/bad)
      const ratio = (color - colorMin) / (colorMax - colorMin || 1)
      const hue = (120 * (1 - ratio)).toFixed(0)
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`

      ctx.beginPath()
      ctx.arc(px, py, 6 * zoom, 0, 2 * Math.PI)
      ctx.fill()

      ctx.strokeStyle = `hsl(${hue}, 100%, 30%)`
      ctx.lineWidth = 1.5
      ctx.stroke()
    })

    // Draw axes
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#333"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${xCol} →`, width / 2, height - 15)
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText(`← ${yCol}`, 0, 0)
    ctx.restore()

    // Draw legend
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillStyle = "#666"
    ctx.fillText(`${colorCol}: ${colorMin.toFixed(2)} (red) → ${colorMax.toFixed(2)} (green)`, padding, padding - 10)
  }, [data, zoom, pan, columnInfo, viewType])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setPan((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const viewTitle = viewType === "top" ? "Top View (X-Y Plane)" : "Side View (X-Z Plane)"

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="font-semibold text-foreground">{viewTitle}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(3, z + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-96 bg-white rounded-b-lg cursor-grab active:cursor-grabbing border border-border"
      />
      <div className="px-6 pb-4 text-sm text-muted-foreground">
        {columnInfo.xCol ? (
          <>
            X: {columnInfo.xCol} • Y: {columnInfo.yCol} • Color: {columnInfo.colorCol} (Zoom: {zoom.toFixed(1)}x)
          </>
        ) : (
          "Loading data..."
        )}
      </div>
    </Card>
  )
}
