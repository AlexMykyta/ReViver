"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Eye, MoreHorizontal, Search, Trash2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type VolunteerStatus = "pendente" | "aprovado" | "rejeitado"

type Volunteer = {
  id: number
  name: string
  email: string
  phone: string
  area: string
  experience: string
  availability: string
  date: string
  status: VolunteerStatus
}

export default function VolunteersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues - only render client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for volunteers
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@exemplo.com",
      phone: "(11) 98765-4321",
      area: "Distribuição",
      experience: "Já trabalhei como voluntária em ONGs de distribuição de alimentos por 2 anos.",
      availability: "Fins de semana",
      date: "2025-03-15",
      status: "pendente",
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao.santos@exemplo.com",
      phone: "(11) 91234-5678",
      area: "Logística",
      experience: "Sou motorista profissional e posso ajudar com transporte de doações.",
      availability: "Noites e fins de semana",
      date: "2025-03-16",
      status: "aprovado",
    },
    {
      id: 3,
      name: "Ana Oliveira",
      email: "ana.oliveira@exemplo.com",
      phone: "(11) 99876-5432",
      area: "Atendimento",
      experience: "Trabalho com atendimento ao público e tenho experiência em assistência social.",
      availability: "Terças e quintas à tarde",
      date: "2025-03-14",
      status: "pendente",
    },
    {
      id: 4,
      name: "Carlos Pereira",
      email: "carlos.pereira@exemplo.com",
      phone: "(11) 98765-1234",
      area: "Distribuição",
      experience: "Sou estudante de serviço social e quero ganhar experiência prática.",
      availability: "Segundas, quartas e sextas",
      date: "2025-03-17",
      status: "pendente",
    },
    {
      id: 5,
      name: "Juliana Costa",
      email: "juliana.costa@exemplo.com",
      phone: "(11) 91234-9876",
      area: "Logística",
      experience: "Tenho experiência em organização de estoques e inventário.",
      availability: "Fins de semana",
      date: "2025-03-13",
      status: "rejeitado",
    },
  ])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  // Filter volunteers based on search term and status filter
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || volunteer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle volunteer approval
  const handleApprove = (id: number) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === id ? { ...volunteer, status: "aprovado" as VolunteerStatus } : volunteer,
      ),
    )

    toast({
      title: "Voluntário aprovado",
      description: "O voluntário foi aprovado com sucesso e pode começar a atuar.",
      variant: "default",
    })
  }

  // Handle volunteer rejection
  const handleReject = (id: number) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === id ? { ...volunteer, status: "rejeitado" as VolunteerStatus } : volunteer,
      ),
    )

    toast({
      title: "Voluntário rejeitado",
      description: "A candidatura do voluntário foi rejeitada.",
      variant: "destructive",
    })
  }

  // Handle volunteer deletion
  const handleDelete = (id: number) => {
    setVolunteers(volunteers.filter((volunteer) => volunteer.id !== id))

    toast({
      title: "Voluntário excluído",
      description: "O voluntário foi excluído permanentemente do sistema.",
      variant: "destructive",
    })
  }

  // View volunteer details
  const handleViewDetails = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer)
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
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Voluntários</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar voluntários..."
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
          <CardTitle>Candidaturas de Voluntários</CardTitle>
          <CardDescription>Gerencie as candidaturas de voluntários. Aprove ou rejeite candidatos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Disponibilidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVolunteers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Nenhum voluntário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.id}</TableCell>
                    <TableCell>{volunteer.name}</TableCell>
                    <TableCell>{volunteer.email}</TableCell>
                    <TableCell>{volunteer.area}</TableCell>
                    <TableCell>{volunteer.availability}</TableCell>
                    <TableCell>{formatDate(volunteer.date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          volunteer.status === "aprovado"
                            ? "success"
                            : volunteer.status === "pendente"
                              ? "outline"
                              : "destructive"
                        }
                        className="flex w-fit items-center gap-1"
                      >
                        {volunteer.status === "aprovado" && <CheckCircle className="h-3 w-3" />}
                        {volunteer.status === "pendente" && <Clock className="h-3 w-3" />}
                        {volunteer.status === "rejeitado" && <XCircle className="h-3 w-3" />}
                        {volunteer.status === "aprovado" && "Aprovado"}
                        {volunteer.status === "pendente" && "Pendente"}
                        {volunteer.status === "rejeitado" && "Rejeitado"}
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
                          <DropdownMenuItem onClick={() => handleViewDetails(volunteer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {volunteer.status === "pendente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(volunteer.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(volunteer.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(volunteer.id)}>
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

      {/* Volunteer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Voluntário</DialogTitle>
            <DialogDescription>Informações completas sobre o candidato a voluntário.</DialogDescription>
          </DialogHeader>
          {selectedVolunteer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Nome:</span>
                <span className="col-span-3">{selectedVolunteer.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Email:</span>
                <span className="col-span-3">{selectedVolunteer.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Telefone:</span>
                <span className="col-span-3">{selectedVolunteer.phone}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Área:</span>
                <span className="col-span-3">{selectedVolunteer.area}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Disponibilidade:</span>
                <span className="col-span-3">{selectedVolunteer.availability}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-sm font-medium">Experiência:</span>
                <span className="col-span-3">{selectedVolunteer.experience}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data:</span>
                <span className="col-span-3">{formatDate(selectedVolunteer.date)}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <Badge
                    variant={
                      selectedVolunteer.status === "aprovado"
                        ? "success"
                        : selectedVolunteer.status === "pendente"
                          ? "outline"
                          : "destructive"
                    }
                    className="flex w-fit items-center gap-1"
                  >
                    {selectedVolunteer.status === "aprovado" && <CheckCircle className="h-3 w-3" />}
                    {selectedVolunteer.status === "pendente" && <Clock className="h-3 w-3" />}
                    {selectedVolunteer.status === "rejeitado" && <XCircle className="h-3 w-3" />}
                    {selectedVolunteer.status === "aprovado" && "Aprovado"}
                    {selectedVolunteer.status === "pendente" && "Pendente"}
                    {selectedVolunteer.status === "rejeitado" && "Rejeitado"}
                  </Badge>
                </span>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                {selectedVolunteer.status === "pendente" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleReject(selectedVolunteer.id)
                        setDetailsOpen(false)
                      }}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      onClick={() => {
                        handleApprove(selectedVolunteer.id)
                        setDetailsOpen(false)
                      }}
                    >
                      Aprovar
                    </Button>
                  </>
                )}
                {selectedVolunteer.status !== "pendente" && (
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

