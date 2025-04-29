import Link from "next/link"
import { Mail, Phone, MapPin, Clock, Heart, Gift, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="header px-4 lg:px-6 h-16 flex items-center">
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
        <section className="hero-section w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre o ReViver</h1>
              <p className="text-muted-foreground md:text-xl max-w-[800px]">
                Conectando doadores a pessoas que precisam, construindo uma comunidade mais solidária.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Nossa Missão</h2>
                <p className="text-muted-foreground">
                  O ReViver nasceu da crença de que todos merecem acesso a coisas essenciais para uma vida digna. A nossa
                  missão é criar uma ponte entre aqueles que têm recursos para doar e aqueles que estão em situação de
                  vulnerabilidade.
                </p>
                <p className="text-muted-foreground">
                  Acreditamos que pequenos gestos de generosidade podem transformar vidas. Ao facilitar a doação de
                  alimentos, roupas e artigos para casa, ajudamos a reduzir o desperdício e promovemos a solidariedade
                  na nossa comunidade.
                </p>
                <div className="flex items-center pt-4">
                  <Heart className="h-10 w-10 text-[#3C4F76] mr-4" />
                  <div>
                    <h3 className="font-bold">Valores</h3>
                    <p className="text-muted-foreground">Solidariedade, Respeito, Transparência e Inclusão</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl">
                  <img
                    src="/images/map.jpg"
                    alt="Comunidade ReViver"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-alt w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">A nossa História</h2>
              <p className="md:text-xl max-w-[800px] opacity-90">Como começamos e onde queremos chegar</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#DDDBF1] mb-4 mx-auto">
                    <span className="text-[#383F51] font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-center text-[#383F51]">O Início</h3>
                  <p className="text-[#3C4F76]">
                  Tudo começou como uma proposta da universidade, em 2025. 
                  Cinco pessoas que nunca se tinham visto antes foram reunidas para um projecto académico. 
                  Foi então que surgiu a ideia — e nasceu o ReViver. 
                  Começámos a planear os primeiros passos com um único objectivo 
                  em mente: ligar quem precisava de ajuda a quem queria ajudar.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#DDDBF1] mb-4 mx-auto">
                    <span className="text-[#383F51] font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-center text-[#383F51]">Crescimento</h3>
                  <p className="text-[#3C4F76]">
                  Com o tempo, mergulhámos no desenvolvimento de código e na criação da nossa plataforma. 
                  No final do semestre, conseguimos ter as coisas basicas no nosso projeto. 
                  Adicionámos categorias de doações, optimizámos o funcionamento do 
                  sistema e tornámos todo o processo de doação e distribuição mais acessível e eficiente através do digital.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#DDDBF1] mb-4 mx-auto">
                    <span className="text-[#383F51] font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-center text-[#383F51]">Futuro</h3>
                  <p className="text-[#3C4F76]">
                  Hoje, olhamos para o futuro com ambição e esperança. 
                  Queremos lançar oficialmente o site, chegar a mais cidades, 
                  abrir centros de distribuição e desenvolver programas educativos 
                  que promovam o consumo consciente e a solidariedade.
                   O que começou como um trabalho universitário está prestes a tornar-se um movimento com impacto real.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-[#383F51]">Nossa Equipe</h2>
              <p className="text-[#3C4F76] md:text-xl max-w-[800px]">
                Conheça as pessoas dedicadas que fazem o ReViver acontecer
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#DDDBF1]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#383F51] font-bold text-xl">
                    CM
                  </div>
                </div>
                <h3 className="font-bold text-[#383F51]">Catarina Machado</h3>
                <p className="text-[#3C4F76]">Fundadora e Diretora</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#DDDBF1]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#383F51] font-bold text-xl">
                    AM
                  </div>
                </div>
                <h3 className="font-bold text-[#383F51]">Alexandre Mykyta</h3>
                <p className="text-[#3C4F76]">Coordenador de Logística</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#DDDBF1]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#383F51] font-bold text-xl">
                    DG
                  </div>
                </div>
                <h3 className="font-bold text-[#383F51]">Diogo Gonçalves</h3>
                <p className="text-[#3C4F76]">Relações Comunitárias</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#DDDBF1]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#383F51] font-bold text-xl">
                    TC
                  </div>
                </div>
                <h3 className="font-bold text-[#383F51]">Tiago Carneiro</h3>
                <p className="text-[#3C4F76]">Desenvolvimento Tecnológico</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#DDDBF1]">
                  <div className="absolute inset-0 flex items-center justify-center text-[#383F51] font-bold text-xl">
                    B
                  </div>
                </div>
                <h3 className="font-bold text-[#383F51]">Beta</h3>
                <p className="text-[#3C4F76]">Gestão de Voluntários</p>
              </div>
            </div>
          </div>
        </section>

        <section className="volunteer-section w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">Entre em Contato</h2>
              <p className="text-[hsl(var(--color-lavender))] md:text-xl max-w-[800px]">
                Estamos aqui para responder suas dúvidas e ouvir suas sugestões
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-[#383F51]">Informações de Contato</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-[#3C4F76] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#383F51]">Email</p>
                        <a href="mailto:contato@reviver.org" className="text-[#3C4F76] hover:underline">
                          contato@reviver.org
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#3C4F76] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#383F51]">Endereço</p>
                        <p className="text-[#3C4F76]">Rua das Flores, 123</p>
                        <p className="text-[#3C4F76]">1000-001 Lisboa, Portugal</p>
                      </div>
                    </div>
                  </div>
                  <div>
                  <div className="flex items-start">
                      <Phone className="h-5 w-5 text-[#3C4F76] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#383F51]">Telefone</p>
                        <a href="tel:+351912345678" className="text-[#3C4F76] hover:underline">
                          +351 912 345 678
                        </a>
                      </div>
                    </div>
                  <div className="flex items-start">
                      <Clock className="h-5 w-5 text-[#3C4F76] mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-[#383F51]">Horário de Atendimento</p>
                        <p className="text-[#3C4F76]">Segunda a Sexta: 9h às 18h</p>
                        <p className="text-[#3C4F76]">Sábado: 10h às 14h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs">© 2025 ReViver. Todos os direitos reservados.</p>
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
