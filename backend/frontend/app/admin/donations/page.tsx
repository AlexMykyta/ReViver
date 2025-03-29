"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MoreHorizontal, Search, Trash2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

type DonationStatus = "pendente" | "aprovado" | "rejeitado"

type Donation = {
  id: number
  title: string
  category: string
  date: string
  status: DonationStatus
  donor: string
}

export default function PendingDonations() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
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
    },
    {
      id: 2,
      title: "Roupas Infantis",
      category: "Roupas",
      date: "2025-03-16",
      status: "pendente",
      donor: "João Santos",
    },
    {
      id: 3,
      title: "Utensílios de Cozinha",
      category: "Casa",
      date: "2025-03-14",
      status: "aprovado",
      donor: "Ana Oliveira",
    },
    {
      id: 4,
      title: "Cobertores",
      category: "Roupas",
      date: "2025-03-17",
      status: "pendente",
      donor: "Carlos Pereira",
    },
    {
      id: 5,
      title: "Alimentos não perecíveis",
      category: "Comida",
      date: "2025-03-13",
      status: "rejeitado",
      donor: "Juliana Costa",
    },
    {
      id: 6,
      title: "Móveis para sala",
      category: "Casa",
      date: "2025-03-18",
      status: "pendente",
      donor: "Roberto Almeida",
    },
    {
      id: 7,
      title: "Roupas de inverno",
      category: "Roupas",
      date: "2025-03-19",
      status: "pendente",
      donor: "Fernanda Lima",
    },
    {
      id: 8,
      title: "Produtos de higiene",
      category: "Casa",
      date: "2025-03-12",
      status: "aprovado",
      donor: "Marcelo Souza",
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

  // Handle donation approval
  const handleApprove = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "aprovado" as DonationStatus } : donation,
      ),
    )

    toast({
      title: "Doação aprovada",
      description: "A doação foi aprovada com sucesso e está disponível na plataforma.",
      variant: "default",
    })
  }

  // Handle donation rejection
  const handleReject = (id: number) => {
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

  // Handle donation deletion
  const handleDelete = (id: number) => {
    setDonations(donations.filter((donation) => donation.id !== id))

    toast({
      title: "Doação excluída",
      description: "A doação foi excluída permanentemente do sistema.",
      variant: "destructive",
    })
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
                              : "destructive"
                        }
                        className="flex w-fit items-center gap-1"
                      >
                        {donation.status === "aprovado" && <CheckCircle className="h-3 w-3" />}
                        {donation.status === "pendente" && <Clock className="h-3 w-3" />}
                        {donation.status === "rejeitado" && <XCircle className="h-3 w-3" />}
                        {donation.status === "aprovado" && "Aprovado"}
                        {donation.status === "pendente" && "Pendente"}
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
                          {donation.status === "pendente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(donation.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(donation.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(donation.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
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
    </div>
  )
}

