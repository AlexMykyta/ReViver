"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "user" | "admin" | "volunteer"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAdmin: boolean
  isVolunteer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isVolunteer, setIsVolunteer] = useState(false)

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setIsAdmin(parsedUser.role === "admin")
      setIsVolunteer(parsedUser.role === "volunteer" || parsedUser.role === "admin")
    }
    setIsLoading(false)
  }, [])

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setIsLoading(false)
      return false
    }

    // For demo purposes, set roles based on email
    const isAdminUser = email.toLowerCase() === "admin@example.com"
    const isVolunteerUser = email.toLowerCase() === "voluntario@example.com" || isAdminUser

    // Simulate successful login
    const mockUser = {
      id: "user-1",
      name: isAdminUser ? "Administrador" : isVolunteerUser ? "Voluntário" : email.split("@")[0],
      email,
      role: isAdminUser ? ("admin" as UserRole) : isVolunteerUser ? ("volunteer" as UserRole) : ("user" as UserRole),
    }

    // Save to state and localStorage
    setUser(mockUser)
    setIsAdmin(isAdminUser)
    setIsVolunteer(isVolunteerUser)
    localStorage.setItem("user", JSON.stringify(mockUser))

    setIsLoading(false)
    return true
  }

  // Register function - in a real app, this would call an API
  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    setIsLoading(true)

    // Simple validation
    if (!name || !email || !password) {
      setIsLoading(false)
      return false
    }

    // For demo purposes, set roles based on email
    const isAdminUser = email.toLowerCase() === "admin@example.com"
    const isVolunteerUser = email.toLowerCase() === "voluntario@example.com" || isAdminUser

    // Simulate successful registration
    const mockUser = {
      id: "user-" + Date.now(),
      name,
      email,
      role: isAdminUser ? ("admin" as UserRole) : isVolunteerUser ? ("volunteer" as UserRole) : ("user" as UserRole),
    }

    // Save to state and localStorage
    setUser(mockUser)
    setIsAdmin(isAdminUser)
    setIsVolunteer(isVolunteerUser)
    localStorage.setItem("user", JSON.stringify(mockUser))

    setIsLoading(false)
    return true
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    setIsVolunteer(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAdmin, isVolunteer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

