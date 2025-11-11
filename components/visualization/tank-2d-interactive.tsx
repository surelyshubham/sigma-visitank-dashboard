"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from "lucide-react"
import { getThicknessColor, thicknessScale } from "./color-mapper"

interface Tank2DInteractiveProps {
  data: Record<string, any>[]
  headers: string[]
  productType: "tank" | "pipe" | "elbow" | "vessel"
}

interface Marker {
  label: string
  x: number
  y: number
  visible: boolean
}

export function Tank2DInteractive({ data, headers, productType }: Tank2DInteractiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)
  const [markers, setMarkers] = useState<Marker[]>([
    { label: "No Scan Area 1", x: 10, y: 20, visible: true },
    { label: "Manhole A", x: 50, y: 50, visible: true },
    { label: "Wind Girder 1", x: 80, y: 30, visible: true },
  ])
  const [visibleMarkers, setVisibleMarkers] = useState(new Set(markers.map((m) => m.label)))
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#ffffff")
    gradient.addColorStop(1, "#f9f9f9")
    ctx.fillStyle = gradient
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

    const padding = 70
    const graphWidth = width - 2 * padding
    const graphHeight = height - 2 * padding

    // Draw grid background
    ctx.strokeStyle = "#e8e8e8"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 20; i++) {
      const x = padding + (i / 20) * graphWidth
      const y = padding + (i / 20) * graphHeight
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + graphHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + graphWidth, y)
      ctx.stroke()
    }

    // Draw axes with labels
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
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`X (${xMin.toFixed(0)}-${xMax.toFixed(0)})`, width / 2, height - 10)
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText(`Y (${yMin.toFixed(0)}-${yMax.toFixed(0)})`, 0, 0)
    ctx.restore()

    // Draw zero point marker
    const zeroPx = padding + ((0 - xMin) / (xMax - xMin)) * graphWidth
    const zeroPy = height - padding - ((0 - yMin) / (yMax - yMin)) * graphHeight
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(zeroPx, zeroPy, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#1e40af"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = "#1e40af"
    ctx.font = "bold 10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("0", zeroPx, zeroPy - 12)

    // Plot data points with enhanced rendering
    const points: any[] = []
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
        ctx.arc(px, py, 6, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Halo for critical zones
        if (thickness < 4) {
          ctx.strokeStyle = "#f97316"
          ctx.lineWidth = 2
          ctx.globalAlpha = 0.3
          ctx.beginPath()
          ctx.arc(px, py, 10, 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        points.push({ px, py, x, y, thickness, idx })
      }
    })

    // Draw markers (No Scan, Manhole, Wind Girder)
    if (visibleMarkers.size > 0) {
      markers.forEach((marker) => {
        if (visibleMarkers.has(marker.label)) {
          const px = padding + (marker.x / 100) * graphWidth
          const py = height - padding - (marker.y / 100) * graphHeight

          // Draw marker pin
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(px, py, 5, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = "#991b1b"
          ctx.lineWidth = 2
          ctx.stroke()

          // Draw marker label
          ctx.fillStyle = "#333"
          ctx.font = "11px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(marker.label, px, py - 12)
        }
      })
    }

    // Draw compass
    const compassSize = 40
    const compassX = width - 70
    const compassY = 50
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassSize, 0, Math.PI * 2)
    ctx.stroke()

    // Compass needle
    ctx.fillStyle = "#f97316"
    ctx.beginPath()
    ctx.moveTo(compassX, compassY - compassSize)
    ctx.lineTo(compassX - 5, compassY + compassSize / 2)
    ctx.lineTo(compassX + 5, compassY + compassSize / 2)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#000"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("N", compassX, compassY - compassSize + 8)
    ctx.fillText("S", compassX, compassY + compassSize - 8)
    ctx.fillText("E", compassX + compassSize - 8, compassY)
    ctx.fillText("W", compassX - compassSize + 8, compassY)

    // Draw legend
    let legendY = 20
    const legendX = 10
    ctx.font = "bold 12px sans-serif"
    ctx.fillStyle = "#333"
    ctx.textAlign = "left"
    ctx.fillText("Color Scale", legendX, legendY)
    legendY += 20

    Object.entries(thicknessScale).forEach(([key, scale]) => {
      ctx.fillStyle = scale.color
      ctx.fillRect(legendX, legendY, 14, 14)
      ctx.fillStyle = "#333"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(scale.label, legendX + 20, legendY + 11)
      legendY += 18
    })
  }, [data, headers, productType, zoom, pan, visibleMarkers, markers])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setPan({
        x: pan.x + deltaX,
        y: pan.y + deltaY,
      })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const toggleMarker = (label: string) => {
    const newVisibleMarkers = new Set(visibleMarkers)
    if (newVisibleMarkers.has(label)) {
      newVisibleMarkers.delete(label)
    } else {
      newVisibleMarkers.add(label)
    }
    setVisibleMarkers(newVisibleMarkers)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
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
        <div className="border-l border-border pl-2 ml-2 flex gap-2">
          {markers.map((marker) => (
            <button
              key={marker.label}
              onClick={() => toggleMarker(marker.label)}
              className={`p-2 rounded transition ${
                visibleMarkers.has(marker.label)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
              title={`Toggle ${marker.label}`}
            >
              {visibleMarkers.has(marker.label) ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-auto">Zoom: {zoom.toFixed(1)}x</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-border rounded-lg bg-white cursor-grab active:cursor-grabbing w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Hovered Point Tooltip */}
      {hoveredPoint && (
        <div className="p-4 bg-card border border-border rounded-lg text-sm space-y-2">
          <p className="font-bold text-foreground">Data Point Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">X Coordinate</p>
              <p className="font-medium text-foreground">{hoveredPoint.x.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Y Coordinate</p>
              <p className="font-medium text-foreground">{hoveredPoint.y.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Thickness</p>
              <p className="font-medium text-foreground">{hoveredPoint.thickness.toFixed(2)} mm</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Health Status</p>
              <p className="font-medium text-foreground">{hoveredPoint.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
