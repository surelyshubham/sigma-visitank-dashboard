"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { StatCard } from "@/components/stat-card"
import { DefectsChart } from "@/components/defects-chart"
import { TankConditionChart } from "@/components/tank-condition-chart"
import { RecentActivityList } from "@/components/recent-activity-list"
import { useState } from "react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Tanks" value="48" icon="🛢️" />
              <StatCard title="Inspections Done" value="156" icon="✓" />
              <StatCard title="Active Defects" value="12" icon="⚠️" />
              <StatCard title="Pending Reports" value="8" icon="📋" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <DefectsChart />
              </div>
              <div>
                <TankConditionChart />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <RecentActivityList />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
