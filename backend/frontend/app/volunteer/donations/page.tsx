"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react";
import { CheckCircle, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type ApprovalStatus = "pendente" | "recebendo" | "aprovado" | "rejeitado"

type Donation = {
  donation_id: number
  title: string
  category: string
  donor: string
  date: string
  status: ApprovalStatus
}

type OrdersIncollection = {
  donation_id: number
  title: string
  category: string
  donor: string
  date: string
  status: ApprovalStatus
  requester : string
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
  const [donations, setDonations] = useState<Donation[]>([])
    const [ordersIncollection, setOrdersIncollection] = useState<OrdersIncollection[]>([])

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const fetchOrdersIncollection = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.")
      }
      try {
        const response = await fetch("http://localhost:8000/api/orders-incollection", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          throw new Error("Erro ao carregar pedidos")
        }
        const data = await response.json()
        console.log("Dados recebidos:", data)
  
        setOrdersIncollection(Array.isArray(data) ? data.map((v: any) => ({
          donation_id: v.donation_id,
          title: v.title,
          category: v.category.category_name,
          donor: v.donor.name,
          date: v.contact,
          status: "pendente",
          requester: v.requester
        })) : [])
  
      } catch (error) {
        toast({ title: "Erro ao carregar pedidos", description: "Não foi possível obter os dados." })
        setOrdersIncollection([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrdersIncollection()
  }, [])

  useEffect(() => {
    setMounted(true)
    const fetchDonations = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.")
      }
      try {
        const response = await fetch("http://localhost:8000/api/pending-donations", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          throw new Error("Erro ao carregar voluntários")
        }
        const data = await response.json()
        console.log("Dados recebidos:", data)
  
        setDonations(Array.isArray(data) ? data.map((v: any) => ({
          donation_id: v.donation_id,
          title: v.title,
          category: v.category.category_name,
          donor: v.donor.name,
          date: v.contact,
          status: "pendente",
        })) : [])
  
      } catch (error) {
        toast({ title: "Erro ao carregar voluntários", description: "Não foi possível obter os dados." })
        setDonations([])
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, [])

     const handleDonationDecision = async (id: number, approve: boolean) => {
      console.log(id);
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.")
      }
      try {
      const response = await fetch(`http://localhost:8000/api/donations/${id}/decision`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: approve ? 1 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar doação")
      }

      setDonations(
        donations.map((donation) =>
          donation.donation_id === id
            ? { ...donation, status: approve ? "aprovado" : "rejeitado" }
            : donation
        )
      )

      toast({
        title: `Doação ${approve ? "aprovada" : "rejeitada"}`,
        description: `A doação foi ${approve ? "aprovada com sucesso." : "rejeitada."}`,
        variant: approve ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }


  const handleApproveVolunteer = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast({ title: "Erro", description: "Faça login novamente", variant: "destructive" });
        return;
      }
  
      const response = await fetch(`http://localhost:8000/api/donations/${id}/delivering`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao aprovar voluntário");
      }
  
      /*setVolunteers(volunteers.map(v => 
        v.id === id ? { ...v, status: "aprovado" } : v
      ));

      setVolunteers(prev => prev.filter(v => v.id !== id));*/
      
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
  

  if (!mounted) return null
  if (loading) return <p>Carregando pedidos...</p>

  const filteredOrdersIncollection = ordersIncollection.filter(
    (orderIncollection) =>
      orderIncollection.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          <TabsTrigger value="volunteers">Pedidos ({filteredOrdersIncollection.length})</TabsTrigger>
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
                    <div key={donation.donation_id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="font-medium">{donation.title}</div>
                        <div className="text-sm text-muted-foreground">{donation.category} • {donation.donor} • {donation.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDonationDecision(donation.donation_id, false)}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Rejeitar
                        </Button>

                        <Button size="sm" onClick={() => handleDonationDecision(donation.donation_id, true)}>
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
              <CardTitle>Pedidos Em Recolha</CardTitle>
              <CardDescription>Aprove ou rejeite pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrdersIncollection.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Nenhum pedido pendente encontrado</div>
              ) : (
                <div className="space-y-4">
                  {filteredOrdersIncollection.map((orderIncollection) => (
                    <div key={orderIncollection.donation_id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <div className="font-medium">Doação: {orderIncollection.title}</div>
                        <div className="text-sm text-muted-foreground">Requerente: {orderIncollection.requester.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleApproveVolunteer(orderIncollection.donation_id)}>
                          <Truck className="mr-2 h-4 w-4" />
                          Entregar
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