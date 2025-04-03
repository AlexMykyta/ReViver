"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Camera, Save, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-provider"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "(11) 98765-4321", // Example data
    bio: "Olá! Estou aqui para ajudar minha comunidade através de doações.", // Example data
    avatarUrl: "/placeholder.svg?height=128&width=128",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize form with user data after component mounts
  useEffect(() => {
    setMounted(true)

    if (user) {
      setFormState((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle avatar upload
  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload the image
    setIsLoading(true)

    setTimeout(() => {
      // Simulate a random avatar
      const randomId = Math.floor(Math.random() * 1000)
      setFormState((prev) => ({
        ...prev,
        avatarUrl: `https://i.pravatar.cc/150?img=${randomId}`,
      }))
      setIsLoading(false)

      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      })
    }, 1500)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would send the updated profile to an API
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    }, 1500)
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Always call useEffect for redirection, but conditionally execute the effect
  useEffect(() => {
    if (mounted && !user) {
      router.push("/login")
    }
  }, [user, router, mounted])

  // If not mounted yet or no user, return null
  if (!mounted || !user) {
    return null
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

      <main className="flex-1 container max-w-3xl py-6 md:py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para página inicial
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais e foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={formState.avatarUrl} alt={formState.name} />
                    <AvatarFallback className="text-2xl">{getInitials(formState.name)}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAvatarUpload}
                    disabled={isLoading}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Alterar foto
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" value={formState.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={formState.email} onChange={handleChange} required disabled />
                    <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações de Contato</h3>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={formState.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Sobre você</Label>
                <Textarea
                  id="bio"
                  value={formState.bio}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Esta informação será exibida publicamente, então tenha cuidado com o que compartilha.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar alterações
                  </>
                )}
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

