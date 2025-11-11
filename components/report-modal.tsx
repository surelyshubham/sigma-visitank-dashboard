"use client"

import { X } from "lucide-react"

export function ReportModal({ report, onClose }) {
  if (!report) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">{report.tankId} - Inspection Report</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Inspection Date</p>
              <p className="text-foreground font-medium">{report.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Status</p>
              <p className="text-accent font-medium">{report.status}</p>
            </div>
          </div>

          {/* Defects List */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Defects Found ({report.defects})</h3>
            <div className="space-y-3">
              {[...Array(report.defects)].map((_, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-foreground">Defect {i + 1}: Corrosion</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        i % 2 === 0 ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"
                      }`}
                    >
                      {i % 2 === 0 ? "Critical" : "Minor"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Location: {i % 2 === 0 ? "Upper shell" : "Bottom seam"}
                  </p>
                  <p className="text-muted-foreground text-sm">Depth: {2 + i}mm</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button className="flex-1 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition font-medium">
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
