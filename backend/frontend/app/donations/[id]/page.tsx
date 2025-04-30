"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Gift, ArrowLeft, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"

interface Donation {
  donation_id: number
  title: string
  description: string
  contact: string
  date: string
  document: string
  category_id: number
  status_id: number
  created_by: number
  donor_name: string
}

export default function DonationDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [similarDonations, setSimilarDonations] = useState<Donation[]>([])
  const [error, setError] = useState("")
  const [mainImageIndex, setMainImageIndex] = useState(0)

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/donations/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Erro ao carregar detalhes da doação")
        setDonation(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchDonation()
  }, [id])

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://127.0.0.1:8000/api/donations", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const all = await res.json()
        const filtered = all.filter(
          (d: Donation) => d.category_id === donation?.category_id && d.donation_id !== donation?.donation_id
        ).slice(0, 3)
        setSimilarDonations(filtered)
      } catch (err) {
        console.error("Erro ao buscar itens similares:", err)
      }
    }
    if (donation?.category_id) fetchSimilar()
  }, [donation?.category_id])

  if (error) return <p className="text-red-500">{error}</p>
  if (!donation) return <p>A carregar...</p>

  const images = (() => {
    try {
      const parsed = JSON.parse(donation.document)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return donation.document ? [donation.document] : []
    }
  })()

  const goPrev = () => setMainImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  const goNext = () => setMainImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))

  const handleRequestDonation = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token || !donation) return
      const res = await fetch(`http://127.0.0.1:8000/api/donations/${donation.donation_id}/request`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
      if (!res.ok) throw new Error("Erro ao solicitar doação")
      alert("Pedido efetuado com sucesso!")
      router.push("/my-requests")
    } catch (err) {
      console.error(err)
      alert("Erro ao solicitar doação.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Gift className="h-6 w-6" />
          <span>ReViver</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/donations" className="text-sm font-medium hover:underline underline-offset-4">Doações</Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">Sobre</Link>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 container py-6 md:py-12">
        <div className="mb-8">
          <Link href="/donations" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para doações
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{donation.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              Categoria {donation.category_id}
            </span>
            <span className="text-sm text-muted-foreground">
              Publicado em {new Date(donation.date).toLocaleDateString("pt-PT")}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {images.length > 0 && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img src={images[mainImageIndex]} alt={`Imagem ${mainImageIndex + 1}`} className="object-cover w-full h-full" />
                <button onClick={goPrev} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={goNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}

            {images.length > 1 && (
              <div className="flex gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} onClick={() => setMainImageIndex(index)} className={`cursor-pointer rounded border-2 ${index === mainImageIndex ? "border-primary" : "border-transparent"}`}>
                    <img src={image} alt={`Imagem ${index + 1}`} className="w-20 h-14 object-cover rounded" />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Descrição</h2>
              <p className="text-muted-foreground">{donation.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Doador:</span>
                  <span>{donation.donor_name}</span>
                </div>
                <Separator className="my-4" />
                <Button className="w-full" onClick={handleRequestDonation}>Solicitar Doação</Button>
              </CardContent>
            </Card>

            {similarDonations.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Itens similares</h3>
                  <div className="space-y-4">
                    {similarDonations.map((item) => {
                      const imgs = (() => {
                        try {
                          const parsed = JSON.parse(item.document)
                          return Array.isArray(parsed) ? parsed : [parsed]
                        } catch {
                          return item.document ? [item.document] : []
                        }
                      })()

                      return (
                        <Link key={item.donation_id} href={`/donations/${item.donation_id}`} className="flex gap-3 hover:bg-muted/50 p-2 rounded-md transition">
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            {imgs[0] ? (
                              <img src={imgs[0]} alt={item.title} className="object-cover w-full h-full" />
                            ) : (
                              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                Sem imagem
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              Publicado em {new Date(item.date).toLocaleDateString("pt-PT")}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
