"use client";

import Link from "next/link"
import { ArrowLeft, Gift } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateDonationForm } from "@/app/donations/new/CreateDonationForm" // <- Certifica-te que o caminho está correto
import { UserNav } from "@/components/user-nav"

export default function NewDonationPage() {
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
          <Link href="/donations" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para doações
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Nova Doação</h1>
          <p className="text-muted-foreground">Preencha o formulário abaixo para registar uma nova doação</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CreateDonationForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
