"use client"

interface Tank3DViewerProps {
  showGrid: boolean
  showCompass: boolean
}

export function Tank3DViewer({ showGrid, showCompass }: Tank3DViewerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">3D Tank Viewer</h3>
        <p className="text-muted-foreground">Three.js 3D visualization</p>
        <p className="text-sm text-muted-foreground mt-2">
          Rotate: Left-click drag • Pan: Right-click drag • Zoom: Scroll wheel
        </p>
      </div>
    </div>
  )
}
