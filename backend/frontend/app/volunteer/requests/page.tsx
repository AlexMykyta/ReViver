"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Eye, MoreHorizontal, Search, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type RequestStatus = "pendente" | "aceito" | "concluído" | "cancelado"

type Request = {
  id: number
  title: string
  category: string
  date: string
  status: RequestStatus
  requester: string
  description: string
}

export default function VolunteerRequestsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues - only render client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for requests
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      title: "Alimentos não perecíveis",
      category: "Comida",
      date: "2025-03-10",
      status: "pendente",
      requester: "Maria Silva",
      description: "Preciso de alimentos não perecíveis para minha família de 5 pessoas.",
    },
    {
      id: 2,
      title: "Roupas para bebê",
      category: "Roupas",
      date: "2025-03-12",
      status: "pendente",
      requester: "João Santos",
      description: "Preciso de roupas para bebê de 6 meses.",
    },
    {
      id: 3,
      title: "Material escolar",
      category: "Outros",
      date: "2025-03-08",
      status: "aceito",
      requester: "Ana Oliveira",
      description: "Preciso de material escolar para duas crianças do ensino fundamental.",
    },
    {
      id: 4,
      title: "Medicamentos",
      category: "Saúde",
      date: "2025-03-14",
      status: "pendente",
      requester: "Carlos Pereira",
      description: "Preciso de medicamentos para hipertensão.",
    },
    {
      id: 5,
      title: "Cobertores",
      category: "Roupas",
      date: "2025-03-11",
      status: "cancelado",
      requester: "Juliana Costa",
      description: "Preciso de cobertores para o inverno.",
    },
  ])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  // Filter requests based on search term and status filter
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle request approval
  const handleApproveRequest = (id: number) => {
    setRequests(
      requests.map((request) => (request.id === id ? { ...request, status: "aceito" as RequestStatus } : request)),
    )

    toast({
      title: "Pedido aceito",
      description: "O pedido foi aceito e será atendido.",
      variant: "default",
    })
  }

  // Handle request completion
  const handleCompleteRequest = (id: number) => {
    setRequests(
      requests.map((request) => (request.id === id ? { ...request, status: "concluído" as RequestStatus } : request)),
    )

    toast({
      title: "Pedido concluído",
      description: "O pedido foi marcado como concluído.",
      variant: "default",
    })
  }

  // Handle request cancellation
  const handleCancelRequest = (id: number) => {
    setRequests(
      requests.map((request) => (request.id === id ? { ...request, status: "cancelado" as RequestStatus } : request)),
    )

    toast({
      title: "Pedido cancelado",
      description: "O pedido foi cancelado e não será atendido.",
      variant: "destructive",
    })
  }

  // View request details
  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request)
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
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Pedidos</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos..."
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
              <SelectItem value="aceito">Aceitos</SelectItem>
              <SelectItem value="concluído">Concluídos</SelectItem>
              <SelectItem value="cancelado">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            Gerencie os pedidos cadastrados na plataforma. Aceite ou cancele solicitações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>{formatDate(request.date)}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "aceito"
                            ? "success"
                            : request.status === "pendente"
                              ? "outline"
                              : request.status === "concluído"
                                ? "default"
                                : "destructive"
                        }
                        className="flex w-fit items-center gap-1"
                      >
                        {request.status === "aceito" && <CheckCircle className="h-3 w-3" />}
                        {request.status === "pendente" && <Clock className="h-3 w-3" />}
                        {request.status === "concluído" && <CheckCircle className="h-3 w-3" />}
                        {request.status === "cancelado" && <XCircle className="h-3 w-3" />}
                        {request.status === "aceito" && "Aceito"}
                        {request.status === "pendente" && "Pendente"}
                        {request.status === "concluído" && "Concluído"}
                        {request.status === "cancelado" && "Cancelado"}
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
                          <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {request.status === "pendente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApproveRequest(request.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Aceitar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancelRequest(request.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Cancelar
                              </DropdownMenuItem>
                            </>
                          )}
                          {request.status === "aceito" && (
                            <DropdownMenuItem onClick={() => handleCompleteRequest(request.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Marcar como concluído
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

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>Informações completas sobre o pedido.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Título:</span>
                <span className="col-span-3">{selectedRequest.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Categoria:</span>
                <span className="col-span-3">{selectedRequest.category}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Solicitante:</span>
                <span className="col-span-3">{selectedRequest.requester}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data:</span>
                <span className="col-span-3">{formatDate(selectedRequest.date)}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-sm font-medium">Descrição:</span>
                <span className="col-span-3">{selectedRequest.description}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <Badge
                    variant={
                      selectedRequest.status === "aceito"
                        ? "success"
                        : selectedRequest.status === "pendente"
                          ? "outline"
                          : selectedRequest.status === "concluído"
                            ? "default"
                            : "destructive"
                    }
                    className="flex w-fit items-center gap-1"
                  >
                    {selectedRequest.status === "aceito" && <CheckCircle className="h-3 w-3" />}
                    {selectedRequest.status === "pendente" && <Clock className="h-3 w-3" />}
                    {selectedRequest.status === "concluído" && <CheckCircle className="h-3 w-3" />}
                    {selectedRequest.status === "cancelado" && <XCircle className="h-3 w-3" />}
                    {selectedRequest.status === "aceito" && "Aceito"}
                    {selectedRequest.status === "pendente" && "Pendente"}
                    {selectedRequest.status === "concluído" && "Concluído"}
                    {selectedRequest.status === "cancelado" && "Cancelado"}
                  </Badge>
                </span>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                {selectedRequest.status === "pendente" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCancelRequest(selectedRequest.id)
                        setDetailsOpen(false)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        handleApproveRequest(selectedRequest.id)
                        setDetailsOpen(false)
                      }}
                    >
                      Aceitar
                    </Button>
                  </>
                )}
                {selectedRequest.status === "aceito" && (
                  <Button
                    onClick={() => {
                      handleCompleteRequest(selectedRequest.id)
                      setDetailsOpen(false)
                    }}
                  >
                    Marcar como concluído
                  </Button>
                )}
                {(selectedRequest.status === "concluído" || selectedRequest.status === "cancelado") && (
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

