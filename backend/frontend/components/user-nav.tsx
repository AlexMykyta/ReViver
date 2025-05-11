"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  LogOut,
  User,
  Gift,
  ShoppingCart,
  CheckCircle2,
  Clipboard,
  Bell
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "./auth-provider"

interface Notification {
  notification_id: number
  message: string
  date: string
  idstatus: number
  title: string
}

export function UserNav() {
  const { user, logout, isAdmin, isVolunteer } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem("auth_token")
    await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === id ? { ...n, idstatus: 2 } : n
      )
    )
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) return

        const res = await fetch("http://127.0.0.1:8000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const data = await res.json()
        setNotifications(data)
      } catch (error) {
        console.error("Erro ao carregar notificações:", error)
        setNotifications([])
      }
    }

    if (user) {
      fetchNotifications()
    }
  }, [user])

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {/* Ícone de Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {Array.isArray(notifications) && notifications.some(n => n.idstatus === 1) && (
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 max-h-96 overflow-y-auto">
              {!Array.isArray(notifications) || notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-2">
                  Sem notificações no momento.
                </p>
              ) : (
                notifications
                  .sort((a, b) => b.notification_id - a.notification_id)
                  .map((n) => (
                    <div
                      key={n.notification_id}
                      className={`p-2 text-sm border-b last:border-none ${n.idstatus === 1 ? 'bg-blue-50' : ''}`}
                    >
                      <p className={`text-sm font-medium ${n.idstatus === 1 ? 'text-primary' : ''}`}>
                        {n.title}
                      </p>
                      <p className="text-muted-foreground text-sm mb-1">{n.message}</p>
                      <p className="text-xs text-muted-foreground italic">
                        {new Date(n.date).toLocaleDateString("pt-PT")}
                      </p>
                      {n.idstatus === 1 && (
                        <Button
                          onClick={() => markAsRead(n.notification_id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs mt-1 px-2 py-1"
                        >
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu do Utilizador */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/approvals">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span>Painel Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {isVolunteer && (
                  <DropdownMenuItem asChild>
                    <Link href="/volunteer/donations">
                      <Clipboard className="mr-2 h-4 w-4" />
                      <span>Painel Voluntário</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/my-donations">
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Minhas Doações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-requests">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Meus Solicitados</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Registar</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
