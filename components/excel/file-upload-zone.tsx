"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"

interface ExcelData {
  id: string
  filename: string
  uploadTime: Date
  metadata: Record<string, any>
  data: Array<Record<string, any>>
  type: "metadata" | "scan-data" | "mixed"
}

interface FileUploadZoneProps {
  onUpload: (data: ExcelData) => void
}

export function FileUploadZone({ onUpload }: FileUploadZoneProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const parseExcelFile = async (file: File) => {
    setIsLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })

      let metadata: Record<string, any> = {}
      let data: Array<Record<string, any>> = []
      let detectedType: "metadata" | "scan-data" | "mixed" = "mixed"

      // Parse all sheets
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" })

        const parsedJson = json.map((row: any) => {
          const parsed: Record<string, any> = {}
          for (const key in row) {
            const val = row[key]
            // Try to parse as number if it looks numeric
            if (typeof val === "string" && !isNaN(val) && val.trim() !== "") {
              parsed[key] = Number.parseFloat(val)
            } else if (typeof val === "number") {
              parsed[key] = val
            } else {
              parsed[key] = val
            }
          }
          return parsed
        })

        if (parsedJson.length > 0) {
          const firstRow = parsedJson[0]
          const keys = Object.keys(firstRow)

          const hasScanColumns = keys.some(
            (k) =>
              k.toLowerCase().includes("thickness") ||
              k.toLowerCase().includes("depth") ||
              k.toLowerCase().includes("coordinate") ||
              k.toLowerCase() === "x" ||
              k.toLowerCase() === "y" ||
              k.toLowerCase().includes("inspection") ||
              k.toLowerCase().includes("corrosion"),
          )

          if (hasScanColumns) {
            data = parsedJson
            detectedType = "scan-data"
          } else if (parsedJson.length < 20 && keys.length <= 5) {
            // Assume small tables are metadata
            metadata = Object.fromEntries(
              parsedJson.map((row: any, idx: number) => [
                keys[0] in row ? row[keys[0]] : `Row ${idx}`,
                keys.length > 1 ? row[keys[1]] : JSON.stringify(row),
              ]),
            )
            detectedType = "metadata"
          } else {
            data = parsedJson
            detectedType = "scan-data"
          }
        }
      }

      const excelData: ExcelData = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        uploadTime: new Date(),
        metadata,
        data,
        type: detectedType,
      }

      onUpload(excelData)
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      alert("Failed to parse Excel file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].name.endsWith(".xlsx") || files[i].name.endsWith(".xls") || files[i].name.endsWith(".csv")) {
          parseExcelFile(files[i])
        }
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        parseExcelFile(e.target.files[i])
      }
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative p-12 rounded-lg border-2 border-dashed transition ${
        dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      <input
        type="file"
        multiple
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        disabled={isLoading}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center justify-center gap-3">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Parsing Excel file...</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-foreground">Drag and drop Excel files here</p>
              <p className="text-sm text-muted-foreground">or click to browse (.xlsx, .xls, .csv)</p>
            </div>
            <Button disabled={isLoading} className="mt-2">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Select Files
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
