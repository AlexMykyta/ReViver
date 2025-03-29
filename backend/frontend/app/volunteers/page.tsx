import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserNav } from "@/components/user-nav"

export default function VolunteersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
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
      <main className="flex-1 container max-w-3xl py-6 md:py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para página inicial
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Seja um Voluntário</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para se candidatar como voluntário na nossa plataforma
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulário de Candidatura</CardTitle>
            <CardDescription>Compartilhe suas informações e experiências para ajudar nossa comunidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Nome</Label>
                <Input id="first-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input id="last-name" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" type="tel" placeholder="(00) 00000-0000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área de Interesse</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distribution">Distribuição de Doações</SelectItem>
                  <SelectItem value="logistics">Logística e Transporte</SelectItem>
                  <SelectItem value="service">Atendimento</SelectItem>
                  <SelectItem value="organization">Organização de Eventos</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Disponibilidade</Label>
              <RadioGroup defaultValue="weekends">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekends" id="weekends" />
                    <Label htmlFor="weekends">Fins de semana</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekdays" id="weekdays" />
                    <Label htmlFor="weekdays">Dias de semana</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evenings" id="evenings" />
                    <Label htmlFor="evenings">Noites</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible">Flexível</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experiência Prévia</Label>
              <Textarea
                id="experience"
                placeholder="Conte-nos sobre sua experiência prévia como voluntário ou em áreas relacionadas"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Motivação</Label>
              <Textarea id="motivation" placeholder="Por que você quer ser voluntário na nossa plataforma?" rows={4} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline">Cancelar</Button>
            <Button>Enviar Candidatura</Button>
          </CardFooter>
        </Card>
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

