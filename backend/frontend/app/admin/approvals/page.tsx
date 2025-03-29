"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, Search, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type ApprovalStatus = "pendente" | "recebendo" | "aprovado" | "rejeitado"

type Donation = {
  id: number
  title: string
  category: string
  donor: string
  date: string
  status: ApprovalStatus
}

type Volunteer = {
  id: number
  name: string
  area: string
  date: string
  status: ApprovalStatus
}

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Fix for hydration issues - only render client-side content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for pending donations
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 1,
      title: "Cesta Básica",
      category: "Comida",
      donor: "Maria Silva",
      date: "2025-03-15",
      status: "pendente",
    },
    {
      id: 2,
      title: "Roupas Infantis",
      category: "Roupas",
      donor: "João Santos",
      date: "2025-03-16",
      status: "pendente",
    },
    {
      id: 4,
      title: "Cobertores",
      category: "Roupas",
      donor: "Carlos Pereira",
      date: "2025-03-17",
      status: "pendente",
    },
    {
      id: 6,
      title: "Móveis para sala",
      category: "Casa",
      donor: "Roberto Almeida",
      date: "2025-03-18",
      status: "pendente",
    },
    {
      id: 7,
      title: "Roupas de inverno",
      category: "Roupas",
      donor: "Fernanda Lima",
      date: "2025-03-19",
      status: "pendente",
    },
  ])

  // Mock data for pending volunteers
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 1,
      name: "Maria Silva",
      area: "Distribuição",
      date: "2025-03-15",
      status: "pendente",
    },
    {
      id: 3,
      name: "Ana Oliveira",
      area: "Atendimento",
      date: "2025-03-14",
      status: "pendente",
    },
    {
      id: 4,
      name: "Carlos Pereira",
      area: "Distribuição",
      date: "2025-03-17",
      status: "pendente",
    },
  ])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  // Filter donations based on search term
  const filteredDonations = donations.filter(
    (donation) =>
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter volunteers based on search term
  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.area.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle donation approval for warehouse receiving
  const handleApproveDonation = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "recebendo" as ApprovalStatus } : donation,
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
        donation.id === id ? { ...donation, status: "aprovado" as ApprovalStatus } : donation,
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
        donation.id === id ? { ...donation, status: "rejeitado" as ApprovalStatus } : donation,
      ),
    )

    toast({
      title: "Doação rejeitada",
      description: "A doação foi rejeitada e não será exibida na plataforma.",
      variant: "destructive",
    })
  }

  // Handle volunteer approval
  const handleApproveVolunteer = (id: number) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === id ? { ...volunteer, status: "aprovado" as ApprovalStatus } : volunteer,
      ),
    )

    toast({
      title: "Voluntário aprovado",
      description: "O voluntário foi aprovado com sucesso e pode começar a atuar.",
      variant: "default",
    })
  }

  // Handle volunteer rejection
  const handleRejectVolunteer = (id: number) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === id ? { ...volunteer, status: "rejeitado" as ApprovalStatus } : volunteer,
      ),
    )

    toast({
      title: "Voluntário rejeitado",
      description: "A candidatura do voluntário foi rejeitada.",
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
        <h1 className="text-2xl font-bold tracking-tight">Aprovações Pendentes</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full sm:w-[250px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations">Doações ({filteredDonations.length})</TabsTrigger>
          <TabsTrigger value="volunteers">Voluntários ({filteredVolunteers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Doações Pendentes</CardTitle>
              <CardDescription>Aprove ou rejeite doações pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDonations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Nenhuma doação pendente encontrada</div>
              ) : (
                <div className="space-y-4">
                  {filteredDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{donation.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {donation.category} • {donation.donor} • {formatDate(donation.date)}
                        </div>
                        {donation.status === "recebendo" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            <Clock className="mr-1 h-3 w-3" />
                            Aguardando chegada no armazém
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {donation.status === "pendente" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleRejectDonation(donation.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              Rejeitar
                            </Button>
                            <Button size="sm" onClick={() => handleApproveDonation(donation.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprovar para recebimento
                            </Button>
                          </>
                        )}
                        {donation.status === "recebendo" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/donations/edit/${donation.id}`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar e publicar
                            </Button>
                            <Button size="sm" onClick={() => handlePublishDonation(donation.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Publicar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Voluntários Pendentes</CardTitle>
              <CardDescription>Aprove ou rejeite candidaturas de voluntários</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVolunteers.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Nenhum voluntário pendente encontrado</div>
              ) : (
                <div className="space-y-4">
                  {filteredVolunteers.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{volunteer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {volunteer.area} • {formatDate(volunteer.date)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleRejectVolunteer(volunteer.id)}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Rejeitar
                        </Button>
                        <Button size="sm" onClick={() => handleApproveVolunteer(volunteer.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprovar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

