"use client"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { Moon, Bell, Lock } from "lucide-react"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState("dark")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Settings & Account</h1>

            {/* Profile Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6">User Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <select className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground">
                    <option>Inspector</option>
                    <option>Manager</option>
                    <option>Administrator</option>
                  </select>
                </div>
                <button className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition font-medium">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Security</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground"
                  />
                </div>
                <button className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition font-medium">
                  Update Password
                </button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Moon size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">Dark mode is currently enabled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-3 py-1 rounded-lg transition ${
                        theme === "light"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-3 py-1 rounded-lg transition ${
                        theme === "dark"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Email notifications for new inspections", key: "inspections" },
                  { label: "Alert me about critical defects", key: "alerts" },
                  { label: "Weekly summary reports", key: "summary" },
                  { label: "Maintenance reminders", key: "maintenance" },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
