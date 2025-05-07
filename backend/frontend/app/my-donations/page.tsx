"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, Pencil, Trash2 } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Donation {
  donation_id: number
  title: string
  category_id: number
  description: string
  date: string
  status_id: number
  document: string | null
}

const statusLabels: Record<number, string> = {
  1: "Pendente",
  2: "Rejeitado",
  3: "Aprovado",
  4: "Solicitado",
  5: "Terminado",
  6: "Em Recolha",
  7: "A Ser Entregue"
}

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialogId, setOpenDialogId] = useState<number | null>(null)
  const [selectedOption, setSelectedOption] = useState<string>("volunteer")
  const [confirmDialogId, setConfirmDialogId] = useState<number | null>(null)
  const [deleteDialogId, setDeleteDialogId] = useState<number | null>(null)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://127.0.0.1:8000/api/donations/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const errorText = await res.text()
        if (!res.ok) throw new Error("Erro ao buscar doações do utilizador")

        const data = JSON.parse(errorText)
        setDonations(data)
      } catch (error) {
        console.error("Erro ao buscar doações:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const donationsByStatus = (statusId: number) =>
    donations.filter(d => d.status_id === statusId)

  const handleUpdateStatus = async (donationId: number, status_id: number) => {
    const token = localStorage.getItem("auth_token")
    await fetch(`http://127.0.0.1:8000/api/donations/${donationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status_id })
    })
    setDonations(prev => prev.map(d => d.donation_id === donationId ? { ...d, status_id } : d))
    setOpenDialogId(null)
    setConfirmDialogId(null)
  }

  const handleDelete = async (donationId: number) => {
    const token = localStorage.getItem("auth_token")
    await fetch(`http://127.0.0.1:8000/api/donations/${donationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setDonations(prev => prev.filter(d => d.donation_id !== donationId))
    setDeleteDialogId(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="header px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>ReViver</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/donations" className="text-sm font-medium hover:underline underline-offset-4">Doações</Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">Sobre</Link>
          <UserNav />
        </nav>
      </header>

      <main className="flex-1 container py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Minhas Doações</h1>
            <p className="text-muted-foreground">Gerencie suas doações e acompanhe o status</p>
          </div>
          <Link href="/donations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Doação
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">Todas ({donations.length})</TabsTrigger>
            {Object.entries(statusLabels).map(([id, label]) => (
              <TabsTrigger key={id} value={id}>{label} ({donationsByStatus(Number(id)).length})</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DonationGrid donations={donations} onEntregaClick={setOpenDialogId} onConfirmEntrega={setConfirmDialogId} onDeleteClick={setDeleteDialogId} />
          </TabsContent>
          {Object.entries(statusLabels).map(([id]) => (
            <TabsContent key={id} value={id} className="mt-6">
              <DonationGrid donations={donationsByStatus(Number(id))} onEntregaClick={setOpenDialogId} onConfirmEntrega={setConfirmDialogId} onDeleteClick={setDeleteDialogId} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Forma de entrega */}
        <Dialog open={openDialogId !== null} onOpenChange={() => setOpenDialogId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Forma de Entrega</DialogTitle>
            </DialogHeader>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="volunteer" id="volunteer" />
                <Label htmlFor="volunteer">Pedir Voluntário</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">Eu Entrego</Label>
              </div>
            </RadioGroup>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() =>
                  handleUpdateStatus(
                    openDialogId!,
                    selectedOption === "volunteer" ? 6 : 7
                  )
                }
              >
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmação de entrega */}
        <Dialog open={confirmDialogId !== null} onOpenChange={() => setConfirmDialogId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Entrega</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">
              Tem a certeza que pretende finalizar esta entrega?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmDialogId(null)}>
                Cancelar
              </Button>
              <Button variant="default" onClick={() => handleUpdateStatus(confirmDialogId!, 5)}>
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmação de eliminação */}
        <Dialog open={deleteDialogId !== null} onOpenChange={() => setDeleteDialogId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Doação</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">
              Tem a certeza que pretende eliminar esta doação? Esta ação não pode ser anulada.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteDialogId(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteDialogId!)}>Eliminar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

function DonationGrid({ donations, onEntregaClick, onConfirmEntrega, onDeleteClick }: {
  donations: Donation[],
  onEntregaClick: (id: number) => void,
  onConfirmEntrega: (id: number) => void,
  onDeleteClick: (id: number) => void
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {donations.map(donation => (
        <Card key={donation.donation_id}>
          <CardHeader className="p-0">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg">
              {donation.document ? (
                <img src={JSON.parse(donation.document)[0]} alt={donation.title} className="object-cover w-full h-full" />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-sm text-muted-foreground">Sem imagem</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{donation.title}</h3>
              <Badge variant="outline">
                {statusLabels[donation.status_id] ?? "Desconhecido"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{donation.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Criado em {new Date(donation.date).toLocaleDateString("pt-PT")}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link href={`/donations/${donation.donation_id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  Detalhes
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              {[1, 2, 3].includes(donation.status_id) && (
                <Link href={`/edit/${donation.donation_id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
              )}
              {donation.status_id === 4 && (
                <Button variant="outline" size="sm" onClick={() => onEntregaClick(donation.donation_id)}>
                  Forma de Entrega
                </Button>
              )}
              {donation.status_id === 7 && (
                <Button variant="destructive" size="sm" onClick={() => onConfirmEntrega(donation.donation_id)}>
                  Entregue
                </Button>
              )}
              {[1, 2, 3].includes(donation.status_id) && (
                <Button variant="ghost" size="sm" onClick={() => onDeleteClick(donation.donation_id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
