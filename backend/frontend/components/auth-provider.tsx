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
  logout: () => void
  isLoading: boolean
  isAdmin: boolean
  isVolunteer: boolean
  setUser: (user: User) => void
  setIsAdmin: (isAdmin: boolean) => void
  setIsVolunteer: (isVolunteer: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isVolunteer, setIsVolunteer] = useState(false)

  // Check for token and fetch user data on initial load
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      fetchUserFromAPI(token)
    } else {
      setIsLoading(false) 
    }
  }, [])

  // Fetch user data from API using the token
  const fetchUserFromAPI = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsAdmin(data.role_id === 3)
        setIsVolunteer(data.role_id === 2)
      } else {
        console.error("Failed to fetch user data.")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    setIsVolunteer(false)
    localStorage.removeItem("auth_token") // Remove token from localStorage
  }

  return (
    <AuthContext.Provider value={{ user, logout, isLoading, isAdmin, isVolunteer, setUser, setIsAdmin, setIsVolunteer }}>
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
