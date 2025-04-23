"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"

// Types
interface Donation {
  donation_id: number
  title: string
  description: string
  contact: string
  category_id: number
  document?: string
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const itemsPerPage = 10

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const authenticated = !!token
    setIsAuthenticated(authenticated)

    const fetchDonations = async () => {
      try {
        const headers: HeadersInit = {}
        if (authenticated) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const res = await fetch("http://127.0.0.1:8000/api/donations", { headers })

        if (!res.ok) throw new Error("Erro ao obter doações")
        const data = await res.json()
        setDonations(data)
      } catch (error) {
        console.error("Erro ao carregar doações:", error)
      }
    }

    fetchDonations()
  }, [])

  const categoryMap: Record<string, number | null> = {
    all: null,
    food: 1,
    clothing: 2,
    household: 3,
  }

  const filteredDonations = donations.filter((d) => {
    const matchesCategory = categoryMap[selectedCategory] ? d.category_id === categoryMap[selectedCategory] : true
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage)
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>ReViver</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/donations" className="text-sm font-medium hover:underline underline-offset-4">Doações</Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">Sobre</Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">Contato</Link>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Doações Disponíveis
            </h1>
          </div>
          {isAuthenticated && (
            <Link href="/donations/new">
              <Button>
                + Nova Doação
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 max-w-md">
            <Input
              placeholder="Buscar doações..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>

          <Tabs defaultValue="all" value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value)
            setCurrentPage(1)
          }}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="food">Comida</TabsTrigger>
              <TabsTrigger value="clothing">Roupas</TabsTrigger>
              <TabsTrigger value="household">Casa</TabsTrigger>
            </TabsList>
            <TabsContent value={selectedCategory} className="mt-6">
              <DonationGrid donations={paginatedDonations} />
              <Pagination currentPage={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 ReViver. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">Termos de Uso</Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">Política de Privacidade</Link>
        </nav>
      </footer>
    </div>
  )
}

function DonationGrid({ donations }: { donations: Donation[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {donations.map((donation) => {
        let imageSrc = null
        if (donation.document) {
          try {
            const parsed = JSON.parse(donation.document)
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageSrc = parsed[0]
            }
          } catch (e) {
            console.warn("Erro ao fazer parse do campo document:", e)
          }
        }

        return (
          <Link
            key={donation.donation_id}
            href={`/donations/${donation.donation_id}`}
            className="block"
          >
            <Card className="h-full flex flex-col transition hover:shadow-lg cursor-pointer">
              <CardHeader className="p-0">
                <div className="w-full h-40 overflow-hidden rounded-t-lg">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={donation.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-3 flex-1">
                <CardTitle className="text-base">{donation.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{donation.description}</p>
              </CardContent>

              <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{donation.contact}</span>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

function Pagination({ currentPage, totalPages, setPage }: { currentPage: number, totalPages: number, setPage: (n: number) => void }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-6 gap-2">
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1
        return (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(page)}
          >
            {page}
          </Button>
        )
      })}
    </div>
  )
}
