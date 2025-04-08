"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, Plus, ArrowRight } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-provider"

type DonationStatus = "pendente" | "aprovado" | "rejeitado"

type Donation = {
  id: number
  title: string
  category: string
  description: string
  date: string
  status: DonationStatus
  image: string
}

export default function MyDonationsPage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues - only render client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for user's donations
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 1,
      title: "Cesta Básica",
      category: "Comida",
      description: "Cesta com alimentos não perecíveis para uma família de 4 pessoas.",
      date: "2025-03-15",
      status: "aprovado",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Roupas Infantis",
      category: "Roupas",
      description: "Conjunto de roupas infantis em bom estado para crianças de 3-5 anos.",
      date: "2025-03-16",
      status: "pendente",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Utensílios de Cozinha",
      category: "Casa",
      description: "Kit com panelas, talheres e outros utensílios de cozinha em bom estado.",
      date: "2025-03-14",
      status: "aprovado",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Cobertores",
      category: "Roupas",
      description: "Cobertores em bom estado para o inverno.",
      date: "2025-03-17",
      status: "rejeitado",
      image: "/placeholder.svg?height=200&width=300",
    },
  ])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  // Filter donations by status
  const pendingDonations = donations.filter((donation) => donation.status === "pendente")
  const approvedDonations = donations.filter((donation) => donation.status === "aprovado")
  const rejectedDonations = donations.filter((donation) => donation.status === "rejeitado")

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
            <TabsTrigger value="pending">Pendentes ({pendingDonations.length})</TabsTrigger>
            <TabsTrigger value="approved">Aprovadas ({approvedDonations.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitadas ({rejectedDonations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {donations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-4">Você ainda não tem doações cadastradas</p>
                  <Link href="/donations/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Doação
                    </Button>
                  </Link>
                </div>
              ) : (
                donations.map((donation) => <DonationCard key={donation.id} donation={donation} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pendingDonations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem doações pendentes</p>
                </div>
              ) : (
                pendingDonations.map((donation) => <DonationCard key={donation.id} donation={donation} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {approvedDonations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem doações aprovadas</p>
                </div>
              ) : (
                approvedDonations.map((donation) => <DonationCard key={donation.id} donation={donation} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rejectedDonations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Você não tem doações rejeitadas</p>
                </div>
              ) : (
                rejectedDonations.map((donation) => <DonationCard key={donation.id} donation={donation} />)
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

function DonationCard({ donation }: { donation: Donation }) {
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          <img src={donation.image || "/placeholder.svg"} alt={donation.title} className="object-cover w-full h-full" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{donation.title}</h3>
          <Badge
            variant={
              donation.status === "aprovado" ? "success" : donation.status === "pendente" ? "outline" : "destructive"
            }
            className="flex items-center gap-1"
          >
            {donation.status === "aprovado" && <CheckCircle className="h-3 w-3" />}
            {donation.status === "pendente" && <Clock className="h-3 w-3" />}
            {donation.status === "rejeitado" && <XCircle className="h-3 w-3" />}
            {donation.status === "aprovado" && "Aprovado"}
            {donation.status === "pendente" && "Pendente"}
            {donation.status === "rejeitado" && "Rejeitado"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{donation.category}</span>
          {/* Localização removida */}
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{donation.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Criado em {formatDate(donation.date)}</p>
          <Link href={`/donations/${donation.id}`}>
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

