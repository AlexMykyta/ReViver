"use client";

import Link from "next/link"
import { ArrowLeft, Gift } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditDonationForm } from "@/app/edit/[id]/EditDonationForm" // <- Certifica-te que o caminho está correto!
import { UserNav } from "@/components/user-nav"

export default function EditDonationPage() {
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
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            Sobre
          </Link>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 container max-w-3xl py-6 md:py-12">
        <div className="mb-8">
          <Link href="/my-donations" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para minhas doações
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Editar Doação</h1>
          <p className="text-muted-foreground">Atualize as informações da sua doação abaixo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EditDonationForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
