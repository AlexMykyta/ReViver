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

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    console.log("Usuário salvo no localStorage:", savedUser)

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setIsAdmin(parsedUser.role === "admin")
      setIsVolunteer(parsedUser.role === "volunteer" || parsedUser.role === "admin")
    }
    setIsLoading(false)
  }, [])

  const roleMap = {
    1: "user",
    2: "volunteer",
    3: "admin"
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" }
    })

    if (!response.ok) {
      setIsLoading(false)
      return false
    }

    const data = await response.json()
    console.log("Resposta da API:", data)

    const loggedUser = {
      id: data.user.id,
      name: data.user.name || email.split("@")[0],
      email: data.user.email,
      role: roleMap[data.user.role] || "user"
    }

    setUser(loggedUser)
    setIsAdmin(loggedUser.role === "admin")
    setIsVolunteer(loggedUser.role === "volunteer" || loggedUser.role === "admin")
    localStorage.setItem("user", JSON.stringify(loggedUser))

    setIsLoading(false)
    window.location.reload()
    return true
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" }
    })

    if (!response.ok) {
      setIsLoading(false)
      return false
    }

    const data = await response.json()
    console.log("Resposta da API (Registro):", data)

    const newUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: roleMap[data.user.role] || "user"
    }

    setUser(newUser)
    setIsAdmin(newUser.role === "admin")
    setIsVolunteer(newUser.role === "volunteer" || newUser.role === "admin")
    localStorage.setItem("user", JSON.stringify(newUser))

    setIsLoading(false)
    window.location.reload()
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    setIsVolunteer(false)
    localStorage.removeItem("user")
    window.location.reload()
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
