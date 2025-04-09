"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, Plus, ArrowRight } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-provider"

type RequestStatus = "pendente" | "aceito" | "concluído" | "cancelado"

type Request = {
  id: number
  title: string
  category: string
  description: string
  date: string
  status: RequestStatus
  donor?: string
}

export default function MyRequestsPage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues - only render client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for user's requests
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      title: "Alimentos não perecíveis",
      category: "Comida",
      description: "Preciso de alimentos não perecíveis para minha família de 5 pessoas.",
      date: "2025-03-10",
      status: "aceito",
      donor: "Maria Silva",
    },
    {
      id: 2,
      title: "Roupas para bebê",
      category: "Roupas",
      description: "Preciso de roupas para bebê de 6 meses.",
      date: "2025-03-12",
      status: "pendente",
    },
    {
      id: 3,
      title: "Material escolar",
      category: "Outros",
      description: "Preciso de material escolar para duas crianças do ensino fundamental.",
      date: "2025-03-08",
      status: "concluído",
      donor: "João Santos",
    },
    {
      id: 4,
      title: "Medicamentos",
      category: "Saúde",
      description: "Preciso de medicamentos para hipertensão.",
      date: "2025-03-14",
      status: "cancelado",
    },
  ])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  // Filter requests by status
  const pendingRequests = requests.filter((request) => request.status === "pendente")
  const acceptedRequests = requests.filter((request) => request.status === "aceito")
  const completedRequests = requests.filter((request) => request.status === "concluído")
  const cancelledRequests = requests.filter((request) => request.status === "cancelado")

  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>ReViver</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/donations" className="text-sm font-medium hover:underline underline-offset-4">
            Doações
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            Sobre
          </Link>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 container py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
            <p className="text-muted-foreground">Gerencie seus pedidos de doação e acompanhe o status</p>
          </div>
          <Link href="/requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Pedido
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({requests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="accepted">Aceitos ({acceptedRequests.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídos ({completedRequests.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({cancelledRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-4">Você ainda não tem pedidos cadastrados</p>
                  <Link href="/requests/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Pedido
                    </Button>
                  </Link>
                </div>
              ) : (
                requests.map((request) => <RequestCard key={request.id} request={request} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem pedidos pendentes</p>
                </div>
              ) : (
                pendingRequests.map((request) => <RequestCard key={request.id} request={request} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="accepted" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {acceptedRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem pedidos aceitos</p>
                </div>
              ) : (
                acceptedRequests.map((request) => <RequestCard key={request.id} request={request} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem pedidos concluídos</p>
                </div>
              ) : (
                completedRequests.map((request) => <RequestCard key={request.id} request={request} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cancelledRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem pedidos cancelados</p>
                </div>
              ) : (
                cancelledRequests.map((request) => <RequestCard key={request.id} request={request} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 ReViver. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Termos de Uso
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function RequestCard({ request }: { request: Request }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{request.title}</h3>
          <Badge
            variant={
              request.status === "aceito"
                ? "success"
                : request.status === "pendente"
                  ? "outline"
                  : request.status === "concluído"
                    ? "default"
                    : "destructive"
            }
            className="flex items-center gap-1"
          >
            {request.status === "aceito" && <CheckCircle className="h-3 w-3" />}
            {request.status === "pendente" && <Clock className="h-3 w-3" />}
            {request.status === "concluído" && <CheckCircle className="h-3 w-3" />}
            {request.status === "cancelado" && <XCircle className="h-3 w-3" />}
            {request.status === "aceito" && "Aceito"}
            {request.status === "pendente" && "Pendente"}
            {request.status === "concluído" && "Concluído"}
            {request.status === "cancelado" && "Cancelado"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{request.category}</span>
          {/* Localização removida */}
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{request.description}</p>
        {request.donor && (
          <p className="text-sm mt-2">
            <span className="font-medium">Doador:</span> {request.donor}
          </p>
        )}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Criado em {formatDate(request.date)}</p>
          <Link href={`/requests/${request.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              Detalhes
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

