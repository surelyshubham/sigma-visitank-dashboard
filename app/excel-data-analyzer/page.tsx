"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploadZone } from "@/components/excel/file-upload-zone"
import { MetadataDisplay } from "@/components/excel/metadata-display"
import { DataPreviewTable } from "@/components/excel/data-preview-table"
import { ChartsVisualization } from "@/components/excel/charts-visualization"
import { Tank3DAdvanced } from "@/components/excel/tank-3d-advanced"
import { Tank2DViewer } from "@/components/excel/tank-2d-viewer"
import { HistoricalComparison } from "@/components/excel/historical-comparison"
import { ReportGenerator } from "@/components/excel/report-generator"

interface ExcelData {
  id: string
  filename: string
  uploadTime: Date
  metadata: Record<string, any>
  data: Array<Record<string, any>>
  type: "metadata" | "scan-data" | "mixed"
}

export default function ExcelDataAnalyzerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [uploads, setUploads] = useState<ExcelData[]>([])
  const [selectedUpload, setSelectedUpload] = useState<ExcelData | null>(null)

  const handleNewUpload = (newUpload: ExcelData) => {
    setUploads([newUpload, ...uploads])
    setSelectedUpload(newUpload)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Excel Data Analyzer</h1>
              <p className="text-muted-foreground mt-2">Upload and visualize tank inspection data from Excel files</p>
            </div>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="metadata" disabled={!selectedUpload}>
                  Metadata
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={!selectedUpload}>
                  Preview
                </TabsTrigger>
                <TabsTrigger value="2d-view" disabled={!selectedUpload}>
                  2D View
                </TabsTrigger>
                <TabsTrigger value="3d-view" disabled={!selectedUpload}>
                  3D View
                </TabsTrigger>
                <TabsTrigger value="charts" disabled={!selectedUpload}>
                  Charts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <FileUploadZone onUpload={handleNewUpload} />
                {uploads.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Recent Uploads</h2>
                    <div className="space-y-2">
                      {uploads.map((upload) => (
                        <div
                          key={upload.id}
                          onClick={() => setSelectedUpload(upload)}
                          className={`p-4 rounded-lg border cursor-pointer transition ${
                            selectedUpload?.id === upload.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{upload.filename}</p>
                              <p className="text-sm text-muted-foreground">
                                {upload.uploadTime.toLocaleString()} • {upload.type}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">
                              {Object.keys(upload.metadata).length} metadata • {upload.data.length} rows
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="metadata">
                {selectedUpload && <MetadataDisplay metadata={selectedUpload.metadata} />}
              </TabsContent>

              <TabsContent value="preview">
                {selectedUpload && <DataPreviewTable data={selectedUpload.data} />}
              </TabsContent>

              <TabsContent value="2d-view">
                {selectedUpload && (
                  <div className="space-y-6">
                    <Tank2DViewer data={selectedUpload.data} metadata={selectedUpload.metadata} viewType="top" />
                    <Tank2DViewer data={selectedUpload.data} metadata={selectedUpload.metadata} viewType="side" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="3d-view">
                {selectedUpload && <Tank3DAdvanced data={selectedUpload.data} metadata={selectedUpload.metadata} />}
              </TabsContent>

              <TabsContent value="charts">
                {selectedUpload && <ChartsVisualization data={selectedUpload.data} />}
              </TabsContent>
            </Tabs>

            {selectedUpload && (
              <div className="flex gap-2">
                <HistoricalComparison uploads={uploads} />
                <ReportGenerator upload={selectedUpload} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
