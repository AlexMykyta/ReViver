import Link from "next/link"
import { ArrowLeft, Calendar, Gift, MessageCircle, Share2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"

export default function DonationDetailsPage({ params }: { params: { id: string } }) {
  // Em uma aplicação real, você buscaria os detalhes da doação com base no ID
  // Aqui estamos usando dados de exemplo
  const donation = {
    id: params.id,
    title: "Roupas Infantis",
    category: "Roupas",
    description:
      "Conjunto de roupas infantis em bom estado para crianças de 3-5 anos. Inclui camisetas, calças, shorts e algumas peças de inverno. Todas as peças estão limpas e em bom estado de conservação, sem manchas ou rasgos.",
    date: "2025-03-16",
    donor: "João Santos",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    status: "disponível",
  }

  // Formatar a data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Gift className="h-6 w-6" />
          <span>DonateHub</span>
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
        <div className="mb-8">
          <Link
            href="/donations"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para doações
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{donation.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">{donation.category}</span>
            <span className="text-sm text-muted-foreground">Publicado em {formatDate(donation.date)}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={donation.images[0] || "/placeholder.svg"}
                alt={donation.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {donation.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${donation.title} - imagem ${index + 2}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Descrição</h2>
              <p className="text-muted-foreground">{donation.description}</p>
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Doador:</span>
                    <span>{donation.donor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Data:</span>
                    <span>{formatDate(donation.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    <span className="capitalize">{donation.status}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Button className="w-full">Solicitar este item</Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Enviar mensagem
                    </Button>
                    <Button variant="ghost" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Itens similares</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src="/placeholder.svg?height=64&width=64"
                          alt="Item similar"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Roupas infantis {item}</h4>
                        <p className="text-xs text-muted-foreground">Disponível há {item} dias</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2025 DonateHub. Todos os direitos reservados.</p>
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

