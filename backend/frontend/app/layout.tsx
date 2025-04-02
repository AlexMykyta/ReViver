
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster" 
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReViver",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster /> {/* ADICIONAR O TOASTER AQUI */}
      </body>
    </html>
  )
}

import './globals.css'
