"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, Plus, ArrowRight } from "lucide-react"
import { UserNav } from "@/components/user-nav"

type Request = {
  id: number
  title: string
  category: string
  description: string
  date: string
  status: number
  donor?: string
  document?: string | null
}

const statusLabels: Record<number, string> = {
  1: "Pendente",
  2: "Rejeitado",
  3: "Aprovado",
  4: "Solicitado",
  5: "Terminado",
  6: "Em Recolha",
  7: "A Ser Entregue"
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://127.0.0.1:8000/api/donations/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!res.ok) throw new Error("Erro ao buscar pedidos")

        const data = await res.json()

        const mapped = data.map((item: any) => ({
          id: item.donation_id,
          title: item.title,
          category: item.category_id,
          description: item.description,
          date: item.date,
          status: Number(item.status_id),
          donor: item.donor?.name ?? undefined,
          document: item.document ?? null
        }))

        setRequests(mapped)
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err)
      }
    }

    fetchRequests()
  }, [])

  if (!mounted) return null

  const requestsByStatus = (statusId: number) => requests.filter(r => r.status === statusId)

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
            <h1 className="text-3xl font-bold tracking-tight">Meus Solicitados</h1>
            <p className="text-muted-foreground">Gerencie seus pedidos de doação e acompanhe o status</p>
          </div>
          <Link href="/donations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Pedido
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">Todos ({requests.length})</TabsTrigger>
            {Object.entries(statusLabels).map(([id, label]) => (
              <TabsTrigger key={id} value={id}>{label} ({requestsByStatus(Number(id)).length})</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <RequestGrid requests={requests} />
          </TabsContent>

          {Object.entries(statusLabels).map(([id, label]) => (
            <TabsContent key={id} value={id} className="mt-6">
              <RequestGrid requests={requestsByStatus(Number(id))} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

function RequestGrid({ requests }: { requests: Request[] }) {
  if (!requests.length) {
    return <p className="text-muted-foreground text-center col-span-full">Nenhum pedido encontrado</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map(request => <RequestCard key={request.id} request={request} />)}
    </div>
  )
}

function RequestCard({ request }: { request: Request }) {
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          {request.document ? (
            <img
              src={JSON.parse(request.document)[0]}
              alt={request.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              Sem imagem
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{request.title}</h3>
          <Badge variant="outline">
            {statusLabels[request.status] ?? "Desconhecido"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{request.category}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{request.description}</p>
        {request.donor && (
          <p className="text-sm mt-2">
            <span className="font-medium">Doador:</span> {request.donor}
          </p>
        )}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Criado em {formatDate(request.date)}</p>
          <Link href={`/donations/${request.id}`}>
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
  return date.toLocaleDateString("pt-PT")
}
