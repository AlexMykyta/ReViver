import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"

export default function DonationsPage() {
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
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contato
          </Link>
          <UserNav />
        </nav>
      </header>
      <main className="flex-1 container py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doações Disponíveis</h1>
            <p className="text-muted-foreground">Encontre itens disponíveis para doação na sua região</p>
          </div>
          <Link href="/donations/new">
            <Button>Nova Doação</Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 max-w-md">
            <Input placeholder="Buscar doações..." className="flex-1" />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="food">Comida</TabsTrigger>
              <TabsTrigger value="clothing">Roupas</TabsTrigger>
              <TabsTrigger value="household">Casa</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <DonationCard key={item} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="food" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((item) => (
                  <DonationCard key={item} category="food" />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="clothing" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((item) => (
                  <DonationCard key={item} category="clothing" />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="household" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((item) => (
                  <DonationCard key={item} category="household" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
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

function DonationCard({ category = "clothing" }) {
  const categoryMap = {
    food: {
      title: "Cesta Básica",
      image: "/placeholder.svg?height=200&width=300",
      description: "Cesta com alimentos não perecíveis para uma família de 4 pessoas.",
    },
    clothing: {
      title: "Roupas Infantis",
      image: "/placeholder.svg?height=200&width=300",
      description: "Conjunto de roupas infantis em bom estado para crianças de 3-5 anos.",
    },
    household: {
      title: "Utensílios de Cozinha",
      image: "/placeholder.svg?height=200&width=300",
      description: "Kit com panelas, talheres e outros utensílios de cozinha em bom estado.",
    },
  }

  const item = categoryMap[category]

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          <img src={item.image || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {category === "food" ? "Comida" : category === "clothing" ? "Roupas" : "Casa"}
          </span>
          {/* Localização removida */}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <p className="text-xs text-muted-foreground">Disponível há 2 dias</p>
        <Link href={`/donations/${category}-${Math.floor(Math.random() * 1000)}`}>
          <Button variant="outline" size="sm">
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

