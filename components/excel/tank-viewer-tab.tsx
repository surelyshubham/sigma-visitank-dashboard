"use client"

import type { UploadedFile } from "@/app/excel-uploads/page"
import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Compass } from "lucide-react"

interface TankViewerTabProps {
  files: UploadedFile[]
}

export function TankViewerTab({ files }: TankViewerTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear
    ctx.fillStyle = "var(--background)"
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Draw 3D tank representation
    drawTank(ctx, canvas.offsetWidth, canvas.offsetHeight, rotation, zoom, files[0])
  }, [rotation, zoom, files])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">3D Tank Visualization</h3>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Canvas */}
        <canvas ref={canvasRef} className="w-full bg-card" style={{ aspectRatio: "16/9" }} />

        {/* Controls */}
        <div className="p-4 border-t border-border flex gap-2 flex-wrap">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            <ZoomIn size={18} />
            Zoom In
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            <ZoomOut size={18} />
            Zoom Out
          </button>
          <button
            onClick={() => {
              setRotation({ x: 0, y: 0 })
              setZoom(1)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:opacity-90 transition"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-foreground">
            <Compass size={18} />
            <span className="text-sm">Orientation: {Math.round(rotation.y)}°</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-muted/50 text-sm text-muted-foreground border-t border-border">
          Drag to rotate • Scroll to zoom • {files[0]?.data?.length || 0} data points plotted
        </div>
      </div>
    </div>
  )
}

function drawTank(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rotation: any,
  zoom: number,
  file: UploadedFile,
) {
  const centerX = width / 2
  const centerY = height / 2
  const baseRadius = 80 * zoom

  // Draw tank body (cylinder)
  ctx.strokeStyle = "hsl(var(--primary))"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(centerX, centerY - 30, baseRadius, 20, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Draw tank sides
  ctx.beginPath()
  ctx.moveTo(centerX - baseRadius, centerY - 30)
  ctx.lineTo(centerX - baseRadius, centerY + 60)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(centerX + baseRadius, centerY - 30)
  ctx.lineTo(centerX + baseRadius, centerY + 60)
  ctx.stroke()

  // Draw tank bottom
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 60, baseRadius, 20, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Plot data points if available
  if (file?.data) {
    file.data.slice(0, 50).forEach((row, idx) => {
      const x = centerX - baseRadius + (idx / 50) * baseRadius * 2
      const y = centerY + 30 - Math.sin(idx / 10) * 20

      // Color by thickness if available
      const thickness = row.thickness || row.Thickness || 0
      const hue = Math.max(0, Math.min(120, thickness * 10))
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // Draw compass
  const compassX = width - 50
  const compassY = 50
  ctx.strokeStyle = "hsl(var(--muted-foreground))"
  ctx.beginPath()
  ctx.arc(compassX, compassY, 20, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = "hsl(var(--muted-foreground))"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("N", compassX, compassY - 22)
  ctx.fillText("S", compassX, compassY + 22)
  ctx.fillText("E", compassX + 22, compassY)
  ctx.fillText("W", compassX - 22, compassY)
}
