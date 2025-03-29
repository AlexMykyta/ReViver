import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { UserNav } from "@/components/user-nav"

export default function NewDonationPage() {
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
            href="/donations"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para doações
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Nova Doação</h1>
          <p className="text-muted-foreground">Preencha o formulário abaixo para cadastrar um novo item para doação</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Item</CardTitle>
            <CardDescription>Forneça detalhes sobre o item que você deseja doar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título da doação</Label>
              <Input id="title" placeholder="Ex: Cesta básica, Roupas infantis, etc." />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <RadioGroup defaultValue="clothing">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="food" id="food" />
                    <Label htmlFor="food">Comida</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clothing" id="clothing" />
                    <Label htmlFor="clothing">Roupas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="household" id="household" />
                    <Label htmlFor="household">Itens para Casa</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o item em detalhes (condição, quantidade, etc.)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Fotos</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Arraste e solte suas fotos aqui</p>
                <p className="text-xs text-muted-foreground mt-1">ou</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Selecionar arquivos
                </Button>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou JPEG (máx. 5MB)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Informações de contato</Label>
              <Input id="contact" placeholder="Telefone ou e-mail para contato" />
              <p className="text-xs text-muted-foreground">
                Suas informações de contato serão visíveis apenas para usuários interessados no item.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline">Cancelar</Button>
            <Button>Publicar Doação</Button>
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

