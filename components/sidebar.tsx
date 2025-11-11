"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Cable as Cube, FileText, Upload, TrendingUp, Settings, ChevronLeft } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
  { href: "/tank-viewer", icon: Cube, label: "Tank 3D Viewer" },
  { href: "/inspection-reports", icon: FileText, label: "Inspection Reports" },
  { href: "/excel-uploads", icon: Upload, label: "Excel Uploads" },
  { href: "/historical-analysis", icon: TrendingUp, label: "Historical Analysis" },
  { href: "/settings", icon: Settings, label: "Settings / Account" },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <h2 className="text-lg font-bold text-sidebar-foreground">Sigma</h2>
            <button onClick={onToggle} className="lg:hidden p-1 hover:bg-sidebar-accent rounded-lg transition">
              <ChevronLeft size={20} className="text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
