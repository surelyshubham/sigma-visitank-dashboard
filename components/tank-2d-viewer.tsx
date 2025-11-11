"use client"

import { useEffect, useRef } from "react"

interface Tank2DViewerProps {
  showGrid: boolean
  showCompass: boolean
}

export function Tank2DViewer({ showGrid, showCompass }: Tank2DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match container
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const tankRadius = 200

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background") || "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "#e0e0e0"
      ctx.lineWidth = 1
      const gridSize = 50
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }
    }

    // Draw tank circle
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, tankRadius, 0, Math.PI * 2)
    ctx.stroke()

    // Draw heatmap points (sample data)
    const sampleData = Array.from({ length: 20 }, (_, i) => ({
      x: centerX + Math.cos((i / 20) * Math.PI * 2) * tankRadius * 0.8,
      y: centerY + Math.sin((i / 20) * Math.PI * 2) * tankRadius * 0.8,
      thickness: Math.random() * 10 + 5,
    }))

    sampleData.forEach((point) => {
      const normalized = (point.thickness - 5) / 10
      const hue = (1 - normalized) * 240
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
      ctx.beginPath()
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw compass if enabled
    if (showCompass) {
      const compassX = 50
      const compassY = 50
      const compassSize = 30

      ctx.font = "12px Arial"
      ctx.fillStyle = "#333"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText("N", compassX, compassY - compassSize)
      ctx.fillText("S", compassX, compassY + compassSize)
      ctx.fillText("E", compassX + compassSize, compassY)
      ctx.fillText("W", compassX - compassSize, compassY)

      ctx.strokeStyle = "#333"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(compassX, compassY - compassSize / 2)
      ctx.lineTo(compassX, compassY + compassSize / 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(compassX - compassSize / 2, compassY)
      ctx.lineTo(compassX + compassSize / 2, compassY)
      ctx.stroke()
    }

    // Draw legend
    ctx.font = "12px Arial"
    ctx.fillStyle = "#333"
    ctx.textAlign = "left"
    ctx.fillText("Thickness (mm)", 10, canvas.height - 60)

    for (let i = 0; i <= 10; i++) {
      const hue = (1 - i / 10) * 240
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
      ctx.fillRect(10, canvas.height - 40 + (i % 5) * 10, 15, 8)
      ctx.fillStyle = "#333"
      ctx.fillText(`${5 + i}mm`, 30, canvas.height - 36 + (i % 5) * 10)
    }
  }, [showGrid, showCompass])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
