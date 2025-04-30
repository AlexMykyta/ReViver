"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, Plus, ArrowRight, Pencil } from "lucide-react"
import { UserNav } from "@/components/user-nav"

interface Donation {
  donation_id: number
  title: string
  category_id: number
  description: string
  date: string
  status_id: number
  document: string | null
}

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://127.0.0.1:8000/api/donations/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const errorText = await res.text()
        if (!res.ok) throw new Error("Erro ao buscar doações do utilizador")

        const data = JSON.parse(errorText)
        setDonations(data)
      } catch (error) {
        console.error("Erro ao buscar doações:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const statusMap: Record<number, { label: string; variant: "success" | "outline" | "destructive" }> = {
    1: { label: "Pendente", variant: "outline" },
    2: { label: "Rejeitado", variant: "destructive" },
    3: { label: "Aprovado", variant: "success" },
    4: { label: "Solicitado", variant: "outline" },
    5: { label: "Terminado", variant: "success" },
    6: { label: "Em Recolha", variant: "outline" },
    7: { label: "A Ser Entregue", variant: "outline" },
  }

  const filteredDonations = (statusFilter?: number[]) => {
    return donations.filter(d => !statusFilter || statusFilter.includes(d.status_id))
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-PT")

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>ReViver</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/donations" className="text-sm font-medium hover:underline underline-offset-4">Doações</Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">Sobre</Link>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 container py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Minhas Doações</h1>
            <p className="text-muted-foreground">Gerencie suas doações e acompanhe o status</p>
          </div>
          <Link href="/donations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Doação
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todas ({donations.length})</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DonationGrid donations={donations} statusMap={statusMap} />
          </TabsContent>
          <TabsContent value="pendentes" className="mt-6">
            <DonationGrid donations={filteredDonations([1])} statusMap={statusMap} />
          </TabsContent>
          <TabsContent value="aprovadas" className="mt-6">
            <DonationGrid donations={filteredDonations([3])} statusMap={statusMap} />
          </TabsContent>
          <TabsContent value="rejeitadas" className="mt-6">
            <DonationGrid donations={filteredDonations([2])} statusMap={statusMap} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function DonationGrid({ donations, statusMap }: { donations: Donation[], statusMap: any }) {
  if (!donations.length) {
    return <p className="text-muted-foreground text-center col-span-full">Nenhuma doação encontrada</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {donations.map(donation => (
        <Card key={donation.donation_id}>
          <CardHeader className="p-0">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg">
              {donation.document ? (
                <img src={JSON.parse(donation.document)[0]} alt={donation.title} className="object-cover w-full h-full" />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-sm text-muted-foreground">Sem imagem</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{donation.title}</h3>
              <Badge variant={statusMap[donation.status_id]?.variant || "outline"}>
                {statusMap[donation.status_id]?.label || "Desconhecido"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{donation.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Criado em {new Date(donation.date).toLocaleDateString("pt-PT")}</p>
            <div className="flex gap-2 mt-2">
              <Link href={`/donations/${donation.donation_id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  Detalhes
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              {[1, 2, 3].includes(donation.status_id) && (
                <Link href={`/edit/${donation.donation_id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
