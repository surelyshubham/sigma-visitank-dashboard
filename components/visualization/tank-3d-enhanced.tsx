"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { RotateCcw, Eye, EyeOff } from "lucide-react"

interface Tank3DEnhancedProps {
  data: Record<string, any>[]
  headers: string[]
  productType: "tank" | "pipe" | "elbow" | "vessel"
}

interface Marker3D {
  label: string
  x: number
  y: number
  z: number
  visible: boolean
}

export function Tank3DEnhanced({ data, headers, productType }: Tank3DEnhancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [markers3D, setMarkers3D] = useState<Marker3D[]>([
    { label: "Manhole", x: 0, y: 1, z: 0, visible: true },
    { label: "Wind Girder", x: 0.5, y: 0.5, z: 0.5, visible: true },
    { label: "No Scan Area", x: -0.5, y: -0.5, z: -0.5, visible: true },
  ])
  const [visibleMarkers3D, setVisibleMarkers3D] = useState(new Set(markers3D.map((m) => m.label)))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#f9f9f9")
    gradient.addColorStop(1, "#e8e8e8")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2
    const radius = 80

    // Draw tank body based on product type
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.fillStyle = "rgba(59, 130, 246, 0.05)"

    if (productType === "tank") {
      // Draw cylinder
      ctx.beginPath()
      ctx.ellipse(centerX, centerY - 60, radius, 30, 0, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(centerX - radius, centerY - 60)
      ctx.lineTo(centerX - radius, centerY + 120)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(centerX + radius, centerY - 60)
      ctx.lineTo(centerX + radius, centerY + 120)
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(centerX, centerY + 120, radius, 30, 0, 0, Math.PI * 2)
      ctx.stroke()
    } else if (productType === "pipe") {
      // Draw horizontal cylinder
      ctx.beginPath()
      ctx.ellipse(centerX - 100, centerY, 30, 80, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(centerX + 100, centerY, 30, 80, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX - 100, centerY - 80)
      ctx.lineTo(centerX + 100, centerY - 80)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX - 100, centerY + 80)
      ctx.lineTo(centerX + 100, centerY + 80)
      ctx.stroke()
    } else if (productType === "vessel") {
      // Draw cylinder with domed ends
      ctx.beginPath()
      ctx.ellipse(centerX, centerY - 80, radius, 25, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(centerX, centerY - 80, radius, 0, Math.PI, true)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(centerX - radius, centerY - 80)
      ctx.lineTo(centerX - radius, centerY + 80)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX + radius, centerY - 80)
      ctx.lineTo(centerX + radius, centerY + 80)
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(centerX, centerY + 80, radius, 25, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(centerX, centerY + 80, radius, 0, Math.PI, false)
      ctx.stroke()
    }

    // Plot data points
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

      // Apply 3D rotation
      const cos_x = Math.cos(rotation.x)
      const sin_x = Math.sin(rotation.x)
      const cos_y = Math.cos(rotation.y)
      const sin_y = Math.sin(rotation.y)

      data.forEach((point, idx) => {
        const px_2d = point[xCol]
        const py_2d = point[yCol]
        const pz_2d = zCol ? point[zCol] : 0

        if (typeof px_2d === "number" && typeof py_2d === "number") {
          const thickness = point[thicknessCol]

          // Normalize coordinates
          const nx = (px_2d - xMin) / (xMax - xMin) - 0.5
          const ny = (py_2d - yMin) / (yMax - yMin) - 0.5
          const nz = typeof pz_2d === "number" ? pz_2d - 0.5 : 0

          // Apply rotation
          const ry1 = ny * cos_x - nz * sin_x
          const rz1 = ny * sin_x + nz * cos_x
          const rx2 = nx * cos_y - rz1 * sin_y
          const rz2 = nx * sin_y + rz1 * cos_y

          const px = centerX + rx2 * radius * 2 * zoom
          const py = centerY + ry1 * radius * 2 * zoom

          // Color based on thickness
          let color = "#22c55e"
          if (thickness / thicknessMax < 0.75) color = "#eab308"
          if (thickness / thicknessMax < 0.5) color = "#f97316"
          if (thickness / thicknessMax < 0.4) color = "#000000"

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

    // Draw markers
    if (visibleMarkers3D.size > 0) {
      markers3D.forEach((marker) => {
        if (visibleMarkers3D.has(marker.label)) {
          // Apply same rotation to markers
          const cos_x = Math.cos(rotation.x)
          const sin_x = Math.sin(rotation.x)
          const cos_y = Math.cos(rotation.y)
          const sin_y = Math.sin(rotation.y)

          const ry1 = marker.y * cos_x - marker.z * sin_x
          const rz1 = marker.y * sin_x + marker.z * cos_x
          const rx2 = marker.x * cos_y - rz1 * sin_y

          const px = centerX + rx2 * radius * 2 * zoom
          const py = centerY + ry1 * radius * 2 * zoom

          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(px, py, 7, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = "#991b1b"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.fillStyle = "#333"
          ctx.font = "11px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(marker.label, px, py - 15)
        }
      })
    }

    // Draw rotation info
    ctx.fillStyle = "#666"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(
      `Rotation: X=${rotation.x.toFixed(2)} Y=${rotation.y.toFixed(2)} | Zoom: ${zoom.toFixed(1)}x`,
      10,
      height - 10,
    )
  }, [data, headers, productType, rotation, zoom, visibleMarkers3D, markers3D])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) * 0.01
      const deltaY = (e.clientY - dragStart.y) * 0.01
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

  const toggleMarker3D = (label: string) => {
    const newVisibleMarkers = new Set(visibleMarkers3D)
    if (newVisibleMarkers.has(label)) {
      newVisibleMarkers.delete(label)
    } else {
      newVisibleMarkers.add(label)
    }
    setVisibleMarkers3D(newVisibleMarkers)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
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
        >
          <RotateCcw size={18} />
        </button>
        <div className="border-l border-border pl-2 ml-2 flex gap-2">
          {markers3D.map((marker) => (
            <button
              key={marker.label}
              onClick={() => toggleMarker3D(marker.label)}
              className={`p-2 rounded transition ${
                visibleMarkers3D.has(marker.label)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {visibleMarkers3D.has(marker.label) ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          ))}
        </div>
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

      <p className="text-xs text-muted-foreground">
        Drag to rotate • Scroll to zoom • Click markers to toggle visibility
      </p>
    </div>
  )
}
