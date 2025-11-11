"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useState, useEffect } from "react"
import { Grid3X3, Compass, Eye, MapPin, Wind } from "lucide-react"
import { Tank2DViewer } from "@/components/tank-2d-viewer"
import { Tank3DViewer } from "@/components/tank-3d-viewer"

export default function TankViewerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d")
  const [showGrid, setShowGrid] = useState(true)
  const [showCompass, setShowCompass] = useState(true)
  const [tankData, setTankData] = useState<any>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem("uploadedTankData")
    if (storedData) {
      try {
        setTankData(JSON.parse(storedData))
      } catch (e) {
        console.error("Failed to parse stored tank data")
      }
    }
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="h-full flex gap-6 p-6">
            {/* Viewer */}
            <div className="flex-1 min-w-0">
              <div className="bg-card border border-border rounded-lg h-full flex flex-col relative overflow-hidden">
                {/* View Mode Toggle */}
                <div className="absolute top-4 left-4 flex gap-2 z-10 bg-card border border-border rounded-lg p-2">
                  <button
                    onClick={() => setViewMode("2d")}
                    className={`px-3 py-1 rounded transition text-sm font-medium ${
                      viewMode === "2d"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    2D Top View
                  </button>
                  <button
                    onClick={() => setViewMode("3d")}
                    className={`px-3 py-1 rounded transition text-sm font-medium ${
                      viewMode === "3d"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    3D View
                  </button>
                </div>

                {/* Toolbar */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-lg transition ${
                      showGrid ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    title="Toggle Grid"
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setShowCompass(!showCompass)}
                    className={`p-2 rounded-lg transition ${
                      showCompass ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    title="Toggle Compass"
                  >
                    <Compass size={18} />
                  </button>
                </div>

                {/* Viewer Content */}
                <div className="flex-1">
                  {viewMode === "2d" ? (
                    <Tank2DViewer showGrid={showGrid} showCompass={showCompass} />
                  ) : (
                    <Tank3DViewer showGrid={showGrid} showCompass={showCompass} tankData={tankData} />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Panel */}
            <div className="w-80 hidden lg:flex flex-col gap-4">
              {/* Tank Info */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-lg font-bold text-foreground mb-4">Tank Metadata</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Tank Name</p>
                    <p className="text-foreground font-medium">Tank 3</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Dimensions (m)</p>
                    <p className="text-foreground font-medium">Ø 25.6 × H 18.2</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Inspection Date</p>
                    <p className="text-foreground font-medium">Nov 8, 2024</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Status</p>
                    <p className="text-accent font-medium">Active</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Mark Locations</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition text-sm">
                    <MapPin size={16} />
                    Mark No-Scan Areas
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition text-sm">
                    <Eye size={16} />
                    Mark Manholes
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition text-sm">
                    <Wind size={16} />
                    Mark Wind Girder
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition text-sm">
                    <MapPin size={16} />
                    Set Zero Point
                  </button>
                </div>
              </div>

              {/* Layer Visibility */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Layers</h3>
                <div className="space-y-2">
                  {["Structure", "Defects", "Annotations", "Measurements"].map((layer) => (
                    <label key={layer} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-foreground">{layer}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
