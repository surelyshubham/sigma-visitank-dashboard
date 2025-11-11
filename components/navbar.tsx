"use client"

import { Menu, Bell, User } from "lucide-react"

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-muted rounded-lg transition">
            <Menu size={20} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SV</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">Sigma Visitank</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-lg transition relative">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition">
            <User size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </nav>
  )
}
