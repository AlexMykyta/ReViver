"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Estado adicional para erros

  const { toast } = useToast()
  const router = useRouter()
  const { setUser, setIsAdmin, setIsVolunteer } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) 
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email, 
          password,
          remember_me: rememberMe 
        }),
      })

      // Verifica se a resposta é JSON
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        throw new Error(text || "Resposta inválida do servidor")
      }

      const data = await response.json()

      if (!response.ok) {
        // Extrai a mensagem de erro do backend ou usa uma padrão
        const errorMessage = data.message || "Credenciais inválidas"
        throw new Error(errorMessage)
      }

      // Login bem-sucedido
      localStorage.setItem("auth_token", data.token)
      setUser(data.user)
      setIsAdmin(data.user.role_id === 3)
      setIsVolunteer(data.user.role_id === 2)

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a página inicial.",
        variant: "default",
      })

      router.push("/")

    } catch (error) {
      let errorMessage = "Ocorreu um erro ao fazer login"
      
      if (error instanceof Error) {
        // Trata mensagens de erro específicas
        if (error.message.includes("These credentials do not match our records")) {
          errorMessage = "E-mail ou senha incorretos"
        } else if (error.message.includes("The email field is required")) {
          errorMessage = "Por favor, insira seu e-mail"
        } else if (error.message.includes("The password field is required")) {
          errorMessage = "Por favor, insira sua senha"
        } else {
          errorMessage = error.message
        }
      }

      // Atualiza o estado de erro e mostra o toast
      setError(errorMessage)
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Exibe o erro acima do formulário, se existir */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/reset-password" className="text-xs text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe} 
            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Lembrar de mim
          </Label>
        </div>
        
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  )
}