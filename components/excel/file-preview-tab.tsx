"use client"

import type { UploadedFile } from "@/app/excel-uploads/page"

interface FilePreviewTabProps {
  files: UploadedFile[]
}

export function FilePreviewTab({ files }: FilePreviewTabProps) {
  return (
    <div className="space-y-6">
      {files.map((file) => (
        <div key={file.id} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{file.name}</h3>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {file.headers?.map((header) => (
                    <th key={header} className="px-4 py-2 text-left text-foreground font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.data?.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    {file.headers?.map((header) => (
                      <td key={header} className="px-4 py-2 text-muted-foreground">
                        {String(row[header] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Showing first 10 rows of {file.data?.length || 0} total rows
          </p>
        </div>
      ))}
    </div>
  )
}
