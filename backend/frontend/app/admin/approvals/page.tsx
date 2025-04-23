"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
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
  motivation: string
  status: ApprovalStatus
  name?: string
}

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
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
  ])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const fetchVolunteers = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.")
      }
      try {
        const response = await fetch("http://localhost:8000/api/volunteer-requests/getPedding", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          throw new Error("Erro ao carregar voluntários")
        }
        const data = await response.json()
        console.log("Dados recebidos:", data)
  
        setVolunteers(Array.isArray(data.reports) ? data.reports.map((v: any) => ({
          id: v.id,
          name: v.name,
          motivation: v.motivation,
          status: "pendente"
        })) : [])
  
      } catch (error) {
        toast({ title: "Erro ao carregar voluntários", description: "Não foi possível obter os dados." })
        setVolunteers([])
      } finally {
        setLoading(false)
      }
    }
    fetchVolunteers()
  }, [])

  const handleApproveDonation = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "aprovado" } : donation
      )
    )
    toast({
      title: "Doação aprovada",
      description: "A doação foi aprovada com sucesso.",
      variant: "default",
    })
  }

  const handleRejectDonation = (id: number) => {
    setDonations(
      donations.map((donation) =>
        donation.id === id ? { ...donation, status: "rejeitado" } : donation
      )
    )
    toast({
      title: "Doação rejeitada",
      description: "A doação foi rejeitada.",
      variant: "destructive",
    })
  }

  const handleApproveVolunteer = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast({ title: "Erro", description: "Faça login novamente", variant: "destructive" });
        return;
      }
  
      const response = await fetch('http://localhost:8000/api/volunteer-requests/updateStatus', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id: id,
          status: "aprovado" 
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao aprovar voluntário");
      }
  
      setVolunteers(volunteers.map(v => 
        v.id === id ? { ...v, status: "aprovado" } : v
      ));

      //faz refresh
      setVolunteers(prev => prev.filter(v => v.id !== id));
      
      toast({ 
        title: "Sucesso", 
        description: "Voluntário aprovado com sucesso",
        variant: "default" 
      });
  
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };
  
  const handleRejectVolunteer = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast({ title: "Erro", description: "Faça login novamente", variant: "destructive" });
        return;
      }
  
      const response = await fetch('http://localhost:8000/api/volunteer-requests/updateStatus', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id: id,
          status: "rejeitado" 
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao rejeitar voluntário");
      }
  
      setVolunteers(volunteers.map(v => 
        v.id === id ? { ...v, status: "rejeitado" } : v
      ));
      //faz refresh
      setVolunteers(prev => prev.filter(v => v.id !== id));

      toast({ 
        title: "Sucesso", 
        description: "Voluntário rejeitado",
        variant: "destructive" 
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  if (!mounted) return null
  if (loading) return <p>Carregando voluntários...</p>

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.motivation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDonations = donations.filter(
    (donation) =>
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Aprovações Pendentes</h1>
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
                    <div key={donation.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="font-medium">{donation.title}</div>
                        <div className="text-sm text-muted-foreground">{donation.category} • {donation.donor} • {donation.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleRejectDonation(donation.id)}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Rejeitar
                        </Button>
                        <Button size="sm" onClick={() => handleApproveDonation(donation.id)}>
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
                    <div key={volunteer.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="font-medium">Nome: {volunteer.name}</div>
                        <div className="text-sm text-muted-foreground">Motivação: {volunteer.motivation}</div>
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