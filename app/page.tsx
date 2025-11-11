"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-foreground">Sigma Visitank</h1>
              <p className="text-lg text-muted-foreground">Tank Inspection & Visualization Platform</p>
              <Link
                href="/dashboard"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
