"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type UserRole = "admin" | "staff" | "client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (role: UserRole) => {
    // Mock users for each role
    const mockUsers: Record<UserRole, User> = {
      admin: {
        id: "admin-1",
        name: "Admin User",
        email: "admin@visitank.com",
        role: "admin",
        company: "Sigma Visitank",
      },
      staff: {
        id: "staff-1",
        name: "Staff Member",
        email: "staff@visitank.com",
        role: "staff",
        company: "Sigma Visitank",
      },
      client: {
        id: "client-1",
        name: "Client User",
        email: "client@visitank.com",
        role: "client",
        company: "Client Company Ltd",
      },
    }
    setUser(mockUsers[role])
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
