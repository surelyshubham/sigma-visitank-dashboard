"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function Page() {
  const { isAuthenticated, login, user } = useAuth()
  const [selectedRole, setSelectedRole] = useState<"admin" | "staff" | "client" | null>(null)

  if (isAuthenticated && user) {
    redirect("/dashboard")
  }

  const handleLogin = (role: "admin" | "staff" | "client") => {
    setSelectedRole(role)
    login(role)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Sigma Visitank</h1>
          <p className="text-muted-foreground">Tank Inspection & Visualization Platform</p>
        </div>

        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle>Select User Role</CardTitle>
            <CardDescription>Choose your role to access the system (demo login)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleLogin("admin")}
              className="w-full"
              variant="default"
              disabled={selectedRole === "admin"}
            >
              {selectedRole === "admin" ? "Logging in as Admin..." : "Admin Login"}
            </Button>
            <Button
              onClick={() => handleLogin("staff")}
              className="w-full"
              variant="outline"
              disabled={selectedRole === "staff"}
            >
              {selectedRole === "staff" ? "Logging in as Staff..." : "Staff Login"}
            </Button>
            <Button
              onClick={() => handleLogin("client")}
              className="w-full"
              variant="outline"
              disabled={selectedRole === "client"}
            >
              {selectedRole === "client" ? "Logging in as Client..." : "Client Login"}
            </Button>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>This is a demo environment with mock authentication.</p>
          <p>Each role has different permissions and dashboard views.</p>
        </div>
      </div>
    </div>
  )
}
