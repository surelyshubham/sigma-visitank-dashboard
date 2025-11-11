"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { RotateCcw, Eye } from "lucide-react"

interface Tank3DCanvasProps {
  data: Record<string, any>[]
  headers: string[]
  productType: "tank" | "pipe" | "elbow" | "vessel"
}

export function Tank3DCanvas({ data, headers, productType }: Tank3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Simple 3D projection rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, width, height)

    // Draw simple 3D tank representation
    const centerX = width / 2
    const centerY = height / 2

    // Draw tank cylinder body
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 50, 80, 30, 0, 0, Math.PI * 2)
    ctx.stroke() // Top ellipse

    ctx.beginPath()
    ctx.moveTo(centerX - 80, centerY - 50)
    ctx.lineTo(centerX - 80, centerY + 100)
    ctx.stroke() // Left side

    ctx.beginPath()
    ctx.moveTo(centerX + 80, centerY - 50)
    ctx.lineTo(centerX + 80, centerY + 100)
    ctx.stroke() // Right side

    ctx.beginPath()
    ctx.ellipse(centerX, centerY + 100, 80, 30, 0, 0, Math.PI * 2)
    ctx.stroke() // Bottom ellipse

    // Plot data points on tank surface
    const xCol = headers.find((h) => h.toLowerCase().includes("x"))
    const yCol = headers.find((h) => h.toLowerCase().includes("y"))
    const zCol = headers.find((h) => h.toLowerCase().includes("z") || h.toLowerCase().includes("height"))
    const thicknessCol = headers.find((h) => h.toLowerCase().includes("thickness") || h.toLowerCase().includes("depth"))

    if (xCol && yCol && thicknessCol && data.length > 0) {
      const xValues = data.map((d) => d[xCol]).filter((v) => typeof v === "number")
      const yValues = data.map((d) => d[yCol]).filter((v) => typeof v === "number")
      const thicknessValues = data.map((d) => d[thicknessCol]).filter((v) => typeof v === "number")

      const xMin = Math.min(...xValues)
      const xMax = Math.max(...xValues)
      const yMin = Math.min(...yValues)
      const yMax = Math.max(...yValues)
      const thicknessMax = Math.max(...thicknessValues, 100)

      data.forEach((point) => {
        const x = point[xCol]
        const y = point[yCol]
        const thickness = point[thicknessCol]

        if (typeof x === "number" && typeof y === "number" && typeof thickness === "number") {
          // Map to tank coordinates
          const normalizedX = (x - xMin) / (xMax - xMin)
          const normalizedY = (y - yMin) / (yMax - yMin)
          const normalizedThickness = thickness / thicknessMax

          // Color based on thickness
          const color = normalizedThickness > 0.75 ? "#22c55e" : normalizedThickness > 0.5 ? "#eab308" : "#f97316"

          const px = centerX - 80 + normalizedX * 160
          const py = centerY - 50 + normalizedY * 150

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(px, py, 5, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = "#333"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })
    }

    // Draw rotation info
    ctx.fillStyle = "#666"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`Rotation: X=${rotation.x.toFixed(2)} Y=${rotation.y.toFixed(2)}`, 10, height - 10)
  }, [data, headers, productType, rotation, zoom])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) * 0.005
      const deltaY = (e.clientY - dragStart.y) * 0.005
      setRotation({
        x: Math.max(-Math.PI, Math.min(Math.PI, rotation.x + deltaY)),
        y: rotation.y + deltaX,
      })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
          className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90"
        >
          -
        </button>
        <button
          onClick={() => {
            setRotation({ x: 0.5, y: 0.5 })
            setZoom(1)
          }}
          className="p-2 bg-secondary text-secondary-foreground rounded hover:opacity-90"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <span className="text-sm text-muted-foreground ml-auto flex items-center gap-1">
          <Eye size={16} /> Drag to rotate
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-border rounded-lg bg-white cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}
