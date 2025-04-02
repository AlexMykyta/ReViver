"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Eye, MoreHorizontal, Search, Truck, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type DonationStatus = "pendente" | "recebendo" | "aprovado" | "rejeitado"

type Donation = {
  id: number
  title: string
  category: string
  date: string
  status: DonationStatus
  donor: string
  description: string
}

export default function VolunteerDonationsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues - only render client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for donations
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 1,
      title: "Cesta Básica",
      category: "Comida",
      date: "2025-03-15",
      status: "pendente",
      donor: "Maria Silva",
      description: "Cesta com alimentos não perecíveis para uma família de 4 pessoas.",
    },
    {
      id: 2,
      title: "Roupas Infantis",
      category: "Roupas",
      date: "2025-03-16",
      status: "pendente",
      donor: "João Santos",
      description: "Conjunto de roupas infantis em bom estado para crianças de 3-5 anos.",
    },
    {
      id: 3,
      title: "Utensílios de Cozinha",
      category: "Casa",
      date: "2025-03-14",
      status: "recebendo",
      donor: "Ana Oliveira",
      description: "Kit com panelas, talheres e outros utensílios de cozinha em bom estado.",
    },
    {
      id: 4,
      title: "Cobertores",
      category: "Roupas",
      date: "2025-03-17",
      status: "pendente",
      donor: "Carlos Pereira",
      description: "Cobertores em bom estado para o inverno.",
    },
    {
      id: 5,
      title: "Alimentos não perecíveis",
      category: "Comida",
      date: "2025-03-13",
      status: "rejeitado",
      donor: "Juliana Costa",
      description: "Pacote com arroz, feijão, macarrão e outros alimentos não perecíveis.",
    },
    {
      id: 6,
      title: "Móveis para sala",
      category: "Casa",
      date: "2025-03-18",
      status: "recebendo",
      donor: "Roberto Almeida",
      description: "Sofá de 3 lugares e mesa de centro em bom estado.",
    },
  ])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  // Filter donations based on search term and status filter
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || donation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle donation approval for warehouse receiving
  const handleApproveDonation = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "recebendo" as DonationStatus } : donation,
      ),
    )

    toast({
      title: "Doação aprovada para recebimento",
      description: "A doação foi aprovada e está aguardando chegada no armazém.",
      variant: "default",
    })
  }

  // Handle donation publishing after it arrives at warehouse
  const handlePublishDonation = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "aprovado" as DonationStatus } : donation,
      ),
    )

    toast({
      title: "Doação publicada",
      description: "A doação foi verificada e publicada na plataforma.",
      variant: "default",
    })
  }

  // Handle donation rejection
  const handleRejectDonation = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "rejeitado" as DonationStatus } : donation,
      ),
    )

    toast({
      title: "Doação rejeitada",
      description: "A doação foi rejeitada e não será exibida na plataforma.",
      variant: "destructive",
    })
  }

  // View donation details
  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation)
    setDetailsOpen(true)
  }

  // Format date to local format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Doações</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar doações..."
              className="w-full sm:w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="recebendo">Recebendo</SelectItem>
              <SelectItem value="aprovado">Aprovados</SelectItem>
              <SelectItem value="rejeitado">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doações</CardTitle>
          <CardDescription>Gerencie as doações cadastradas na plataforma. Aprove ou rejeite itens.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Doador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Nenhuma doação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.id}</TableCell>
                    <TableCell>{donation.title}</TableCell>
                    <TableCell>{donation.category}</TableCell>
                    <TableCell>{formatDate(donation.date)}</TableCell>
                    <TableCell>{donation.donor}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          donation.status === "aprovado"
                            ? "success"
                            : donation.status === "pendente"
                              ? "outline"
                              : donation.status === "recebendo"
                                ? "secondary"
                                : "destructive"
                        }
                        className="flex w-fit items-center gap-1"
                      >
                        {donation.status === "aprovado" && <CheckCircle className="h-3 w-3" />}
                        {donation.status === "pendente" && <Clock className="h-3 w-3" />}
                        {donation.status === "recebendo" && <Truck className="h-3 w-3" />}
                        {donation.status === "rejeitado" && <XCircle className="h-3 w-3" />}
                        {donation.status === "aprovado" && "Aprovado"}
                        {donation.status === "pendente" && "Pendente"}
                        {donation.status === "recebendo" && "Recebendo"}
                        {donation.status === "rejeitado" && "Rejeitado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(donation)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {donation.status === "pendente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApproveDonation(donation.id)}>
                                <Truck className="mr-2 h-4 w-4 text-blue-500" />
                                Aprovar para recebimento
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectDonation(donation.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}
                          {donation.status === "recebendo" && (
                            <DropdownMenuItem onClick={() => handlePublishDonation(donation.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Publicar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Donation Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Doação</DialogTitle>
            <DialogDescription>Informações completas sobre o item doado.</DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Título:</span>
                <span className="col-span-3">{selectedDonation.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Categoria:</span>
                <span className="col-span-3">{selectedDonation.category}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Doador:</span>
                <span className="col-span-3">{selectedDonation.donor}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data:</span>
                <span className="col-span-3">{formatDate(selectedDonation.date)}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-sm font-medium">Descrição:</span>
                <span className="col-span-3">{selectedDonation.description}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <Badge
                    variant={
                      selectedDonation.status === "aprovado"
                        ? "success"
                        : selectedDonation.status === "pendente"
                          ? "outline"
                          : selectedDonation.status === "recebendo"
                            ? "secondary"
                            : "destructive"
                    }
                    className="flex w-fit items-center gap-1"
                  >
                    {selectedDonation.status === "aprovado" && <CheckCircle className="h-3 w-3" />}
                    {selectedDonation.status === "pendente" && <Clock className="h-3 w-3" />}
                    {selectedDonation.status === "recebendo" && <Truck className="h-3 w-3" />}
                    {selectedDonation.status === "rejeitado" && <XCircle className="h-3 w-3" />}
                    {selectedDonation.status === "aprovado" && "Aprovado"}
                    {selectedDonation.status === "pendente" && "Pendente"}
                    {selectedDonation.status === "recebendo" && "Recebendo"}
                    {selectedDonation.status === "rejeitado" && "Rejeitado"}
                  </Badge>
                </span>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                {selectedDonation.status === "pendente" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleRejectDonation(selectedDonation.id)
                        setDetailsOpen(false)
                      }}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      onClick={() => {
                        handleApproveDonation(selectedDonation.id)
                        setDetailsOpen(false)
                      }}
                    >
                      Aprovar para recebimento
                    </Button>
                  </>
                )}
                {selectedDonation.status === "recebendo" && (
                  <Button
                    onClick={() => {
                      handlePublishDonation(selectedDonation.id)
                      setDetailsOpen(false)
                    }}
                  >
                    Publicar
                  </Button>
                )}
                {selectedDonation.status !== "pendente" && selectedDonation.status !== "recebendo" && (
                  <Button onClick={() => setDetailsOpen(false)}>Fechar</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

