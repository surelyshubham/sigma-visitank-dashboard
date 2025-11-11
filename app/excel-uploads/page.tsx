"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { Upload, File, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import * as XLSX from "xlsx"
import { setInspectionData } from "@/lib/inspection-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UploadedFile {
  id: string
  name: string
  sheetName: string
  status: "completed" | "processing" | "error"
  size: string
  data?: Record<string, any>[]
  headers?: string[]
  timestamp?: Date
  tankId?: string
  errorMessage?: string
  productType?: "tank" | "pipe" | "elbow" | "vessel"
}

export default function ExcelUploadsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [lastUploadedData, setLastUploadedData] = useState<UploadedFile | null>(null)
  const [selectedProductType, setSelectedProductType] = useState<"tank" | "pipe" | "elbow" | "vessel">("tank")

  const handleFileSelect = async (files: FileList) => {
    const newFiles: UploadedFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileId = `${Date.now()}-${i}`
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        sheetName: "",
        status: "processing",
        size: formatFileSize(file.size),
        tankId: extractTankId(file.name),
        productType: selectedProductType,
      }

      newFiles.push(newFile)

      // Parse Excel/CSV file with XLSX
      try {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const firstSheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" })

        const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : []

        const typedData = jsonData.map((row: any) => {
          const newRow: Record<string, any> = {}
          headers.forEach((header) => {
            const val = row[header]
            // Try to convert to number if it looks like a number
            newRow[header] = typeof val === "string" && !isNaN(Number.parseFloat(val)) ? Number.parseFloat(val) : val
          })
          return newRow
        })

        newFile.status = "completed"
        newFile.data = typedData
        newFile.headers = headers
        newFile.sheetName = firstSheetName
        newFile.timestamp = new Date()
        setLastUploadedData(newFile)
      } catch (error) {
        newFile.status = "error"
        newFile.errorMessage = error instanceof Error ? error.message : "Failed to parse file"
      }
    }

    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId))
  }

  const handleViewInViewer = (file: UploadedFile) => {
    if (file.data && file.headers) {
      setInspectionData({
        id: file.id,
        productType: selectedProductType,
        fileName: file.name,
        data: file.data,
        headers: file.headers,
        metadata: {
          uploadDate: file.timestamp,
        },
      })
    }
  }

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed" && f.data)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Excel Uploads & Data Preview</h1>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground">Product Type:</label>
                <Select value={selectedProductType} onValueChange={(val: any) => setSelectedProductType(val)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tank">Tank (Vertical Cylinder)</SelectItem>
                    <SelectItem value="pipe">Pipe (Horizontal Cylinder)</SelectItem>
                    <SelectItem value="elbow">Elbow (90° Curved)</SelectItem>
                    <SelectItem value="vessel">Vessel (Domed Cylinder)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Card */}
            <div
              className={`bg-card border-2 border-dashed rounded-lg p-12 text-center transition cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload size={48} className="mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload Excel File</h2>
              <p className="text-muted-foreground mb-4">Supports .xlsx, .xls and .csv formats</p>
              <input
                type="file"
                multiple
                accept=".xlsx,.xls,.csv"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <button
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition font-medium cursor-pointer"
                >
                  Select Files
                </button>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Uploaded Files ({uploadedFiles.length})</h2>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition"
                    >
                      <File size={24} className="text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.size}
                          {file.sheetName && ` • Sheet: ${file.sheetName}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "completed" && <CheckCircle size={20} className="text-accent" />}
                        {file.status === "processing" && (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                        {file.status === "error" && (
                          <>
                            <AlertCircle size={20} className="text-destructive" />
                            <span className="text-destructive text-sm font-medium">{file.errorMessage}</span>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 hover:bg-muted rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Preview Section */}
            {completedFiles.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Data Preview</h2>
                {completedFiles.map((file) => (
                  <div key={file.id} className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/50">
                      <h3 className="font-bold text-foreground">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Product: {selectedProductType.charAt(0).toUpperCase() + selectedProductType.slice(1)} • Sheet:{" "}
                        {file.sheetName} • {file.data?.length || 0} rows • {file.headers?.length || 0} columns
                      </p>
                      {file.data && file.data.length > 20 && (
                        <p className="text-sm text-accent mt-2">Showing first 20 rows for preview</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            handleViewInViewer(file)
                            window.location.href = "/tank-viewer"
                          }}
                          className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition text-sm font-medium"
                        >
                          View in 3D Viewer
                        </button>
                        <button
                          onClick={() => (window.location.href = "/historical-analysis")}
                          className="px-4 py-2 bg-secondary hover:opacity-90 text-secondary-foreground rounded-lg transition text-sm font-medium"
                        >
                          View Analysis
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            {file.headers?.map((header) => (
                              <th key={header} className="px-6 py-3 text-left text-sm font-bold text-foreground">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {file.data?.slice(0, 20).map((row, idx) => (
                            <tr key={idx} className="border-b border-border hover:bg-muted/20 transition">
                              {file.headers?.map((header) => {
                                const value = row[header]
                                let cellClass = "px-6 py-3 text-sm text-foreground"

                                if (value === "" || value === null || value === undefined) {
                                  cellClass += " bg-yellow-100/20 text-yellow-700"
                                } else if (typeof value === "number" && value < 0) {
                                  cellClass += " bg-red-100/20 text-red-700"
                                } else if (typeof value === "number" && value > 50) {
                                  cellClass += " bg-orange-100/20 text-orange-700"
                                }

                                return (
                                  <td key={header} className={cellClass}>
                                    {value !== "" && value !== null && value !== undefined
                                      ? typeof value === "number"
                                        ? value.toFixed(2)
                                        : String(value)
                                      : "—"}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function extractTankId(filename: string): string {
  const match = filename.match(/Tank[_\s]*(\d+)/i)
  return match ? match[1] : "Unknown"
}
