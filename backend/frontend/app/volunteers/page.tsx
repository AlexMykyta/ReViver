"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { UserNav } from "@/components/user-nav"

type Availability = "weekends" | "weekdays" | "evenings"

export default function VolunteersPage() {
  const [availability, setAvailability] = useState<Availability>("weekends")
  const [motivation, setMotivation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isLoading: authLoading, logout } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check authentication state
    if (authLoading) {
      setError("Verificando autenticação...")
      return
    }

    if (!user) {
      setError("Por favor, faça login para enviar sua candidatura")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        logout()
        throw new Error("Sessão expirada. Faça login novamente.")
      }

      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/volunteer-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          availability,
          motivation,
          role_id: user.role === "volunteer" ? 2 : 1,
        })
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        throw new Error(text || "Resposta inválida do servidor")
      }

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          throw new Error("Sessão expirada. Faça login novamente.")
        }
        throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`)
      }

      if (!data.success) {
        throw new Error(data.message || "Sua candidatura não pôde ser enviada")
      }
      router.push('/')
    } catch (err) {
      let errorMessage = "Ocorreu um erro inesperado"
      
      if (err instanceof Error) {
        // Handle HTML error pages
        if (err.message.startsWith("<!DOCTYPE html>")) {
          errorMessage = "Erro no servidor. Por favor, tente novamente mais tarde."
        } else {
          errorMessage = err.message
          // Clean up Laravel validation errors
          if (err.message.includes("validation.required")) {
            errorMessage = "Por favor, preencha todos os campos obrigatórios"
          }
        }
      }
      
      setError(errorMessage)
      //console.error("Erro na submissão:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="header px-4 lg:px-6 h-16 flex items-center">
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

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Candidatura</CardTitle>
              <CardDescription>
                Compartilhe suas informações e experiências para ajudar nossa comunidade
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label>Disponibilidade*</Label>
                <RadioGroup 
                  value={availability}
                  onValueChange={(value: Availability) => setAvailability(value)}
                  required
                >
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
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Motivação*</Label>
                <Textarea
                  id="motivation"
                  placeholder="Por que você quer ser voluntário na nossa plataforma? (mínimo 10 caracteres)"
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  required
                  minLength={10}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || authLoading}
                aria-disabled={isSubmitting || authLoading}
              >
                {isSubmitting ? "Enviando..." : "Enviar Candidatura"}
              </Button>
            </CardFooter>
          </Card>
        </form>
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