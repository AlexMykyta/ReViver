import Link from "next/link"
import { ArrowRight, Gift, Home, ShoppingBag, Users, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Gift className="h-6 w-6" />
          <span>ReViver</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/donations" className="text-sm font-medium hover:underline underline-offset-4">
            Doações
          </Link>
          <Link href="/volunteers" className="text-sm font-medium hover:underline underline-offset-4">
            Ser Voluntário
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            Sobre
          </Link>
          <UserNav />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundColor: "#ECE9E9" }}>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Compartilhe o que você não precisa com quem realmente necessita
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  A nossa plataforma conecta doadores a pessoas que precisam de comida, roupas e artigos para casa. Faça a
                  diferença na nossa comunidade hoje.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/donations">
                    <Button size="lg" className="w-full sm:w-auto">
                      Ver doações
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/donations/new">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Doar item
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Pessoas compartilhando doações"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como funciona</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Três passos simples para começar a doar ou receber artigos
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Utensils className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Comida</h3>
                <p className="text-muted-foreground">
                  Doe alimentos não perecíveis para famílias necessitadas.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Roupas</h3>
                <p className="text-muted-foreground">
                  Doe roupas em bom estado que você não usa mais com quem precisa.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Artigos para Casa</h3>
                <p className="text-muted-foreground">
                  Doe móveis, utensílios e outros artigos domésticos para ajudar famílias a montar os seus lares.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Torne-se um Voluntário</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ajude-nos a fazer a diferença
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Junte-se à Nossa Equipe</h3>
                  <p className="text-muted-foreground mb-6">
                    Estamos sempre procurando pessoas dedicadas para ajudar em nossas operações de distribuição,
                    logística e atendimento.
                  </p>
                  <Link href="/volunteers">
                    <Button className="w-full sm:w-auto">
                      <Users className="mr-2 h-4 w-4" />
                      Candidatar-se
                    </Button>
                  </Link>
                </div>
                <div className="bg-muted">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Voluntários trabalhando juntos"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
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

