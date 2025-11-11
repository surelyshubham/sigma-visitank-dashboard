"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { Download, Eye, Zap } from "lucide-react"
import { ReportModal } from "@/components/report-modal"

const reports = [
  { id: 1, tankId: "Tank 1", date: "Nov 15, 2024", defects: 3, status: "Complete", severity: "low" },
  { id: 2, tankId: "Tank 3", date: "Nov 14, 2024", defects: 7, status: "Complete", severity: "high" },
  { id: 3, tankId: "Tank 5", date: "Nov 13, 2024", defects: 2, status: "Complete", severity: "low" },
  { id: 4, tankId: "Tank 8", date: "Nov 12, 2024", defects: 5, status: "Pending", severity: "medium" },
  { id: 5, tankId: "Tank 12", date: "Nov 11, 2024", defects: 9, status: "Complete", severity: "high" },
]

export default function InspectionReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-foreground">Inspection Reports</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition">
                <Zap size={18} />
                Generate Auto Report
              </button>
            </div>

            {/* Reports Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">Tank ID</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">Inspection Date</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">Defects Found</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="border-b border-border hover:bg-muted/30 transition">
                        <td className="px-6 py-4 text-foreground font-medium">{report.tankId}</td>
                        <td className="px-6 py-4 text-foreground">{report.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              report.severity === "high"
                                ? "bg-destructive/20 text-destructive"
                                : report.severity === "medium"
                                  ? "bg-accent/20 text-accent"
                                  : "bg-accent/20 text-accent"
                            }`}
                          >
                            {report.defects} defects
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              report.status === "Complete"
                                ? "bg-accent/20 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="p-2 hover:bg-muted rounded-lg transition"
                              title="View Details"
                            >
                              <Eye size={18} className="text-primary" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition" title="Download">
                              <Download size={18} className="text-foreground" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  )
}
