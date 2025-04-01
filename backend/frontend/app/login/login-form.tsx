"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("API Response:", data); // Verifica a resposta no console
  
      if (!response.ok) {
        throw new Error(data.message || "Erro desconhecido.");
      }
  
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a página inicial.",
        variant: "default",
      });
  
      // Verifica o tipo de usuário e redireciona
      if (data.user.role === 3) {
        router.push("/admin");
      } else if (data.user.role === 2) {
        router.push("/voluntario");
      } else {
        router.push("/user");
      }
  
    } catch (error: any) {
      console.error("Erro na requisição:", error);
  
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Erro ao conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
return (
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
      <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
      <Label htmlFor="remember" className="text-sm font-normal">
        Lembrar de mim
      </Label>
    </div>
    <Button className="w-full" type="submit" disabled={isLoading}>
      {isLoading ? "Entrando..." : "Entrar"}
    </Button>
  </form>
)
}
