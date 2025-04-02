"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"


export function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Combina primeiro e último nome
    const fullName = `${firstName} ${lastName}`.trim()

    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem. Por favor, verifique e tente novamente.",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Erro de validação",
        description: "Você precisa aceitar os termos de uso e política de privacidade.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setApiErrors({})

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: fullName,  // Campo único para nome completo
          email: email,
          password: password,
          password_confirmation: confirmPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Trata erros de validação do Laravel
        if (data.errors) {
          setApiErrors(data.errors)
          throw new Error("Por favor, corrija os erros no formulário.")
        }
        throw new Error(data.message || "Erro no registro")
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para a página inicial.",
        variant: "default",
      })
      
      router.push("/")

    } catch (error: any) {
      console.error("Erro no registro:", error)
      
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">Nome</Label>
          <Input
            id="first-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
          />
          {apiErrors.name && (
            <p className="text-sm text-red-500">{apiErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Sobrenome</Label>
          <Input
            id="last-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {apiErrors.email && (
          <p className="text-sm text-red-500">{apiErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {apiErrors.password && (
          <p className="text-sm text-red-500">{apiErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar senha</Label>
        <Input
          id="confirm-password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          required
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          disabled={isLoading}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          Eu concordo com os{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
        </Label>
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  )
}