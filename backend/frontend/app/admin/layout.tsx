"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Gift, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout, isLoading } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("Montado:", mounted)
    console.log("Usuário:", user)
    console.log("É Admin:", isAdmin)
    console.log("Carregando:", isLoading)

    if (mounted && !isLoading && user && !isAdmin) {
      router.push("/login")
    }
  }, [user, isAdmin, isLoading, router, mounted])

  if (!mounted || isLoading) return <p className="text-center mt-10">Carregando...</p>

  if (!isAdmin) return <p className="text-center mt-10 text-red-500">Acesso Negado.</p>

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Gift className="h-6 w-6" />
            <span>ReViver Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-2 space-y-1">
          <Link href="/admin/approvals" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Gift className="h-5 w-5" />
            Pedidos Pendentes
          </Link>
          <Link href="/admin/volunteers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Users className="h-5 w-5" />
            Voluntários
          </Link>
        </nav>
        <div className="border-t p-4">
          {user && (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
          <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => { logout(); router.push("/") }}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute left-4 top-3 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/admin" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                <Gift className="h-6 w-6" />
                <span>ReViver Admin</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-auto py-4 px-2 space-y-1">
              <Link href="/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link href="/admin/approvals" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                <Gift className="h-5 w-5" />
                Pedidos Pendentes
              </Link>
              <Link href="/admin/volunteers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setOpen(false)}>
                <Users className="h-5 w-5" />
                Voluntários
              </Link>
            </nav>
            <div className="border-t p-4">
              {user && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => { logout(); router.push("/"); setOpen(false) }}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="h-14 border-b bg-background flex items-center px-4 md:px-6">
          <div className="md:hidden w-8"></div>
          <h1 className="text-lg font-semibold">Painel Administrativo</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Ver site
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children || <p className="text-center text-gray-500">Nenhum conteúdo disponível.</p>}
        </main>
      </div>
    </div>
  )
}
