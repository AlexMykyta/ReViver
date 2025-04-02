import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

export default function VolunteerDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations">Doações Recentes</TabsTrigger>
          <TabsTrigger value="requests">Pedidos Recentes</TabsTrigger>
        </TabsList>
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doações Recentes</CardTitle>
              <CardDescription>Últimas 5 doações adicionadas à plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[25px_1fr_120px_120px] items-center gap-4 border-b pb-2">
                  <span className="font-medium">#</span>
                  <span className="font-medium">Item</span>
                  <span className="font-medium">Categoria</span>
                  <span className="font-medium">Status</span>
                </div>
                {[
                  { id: 1, name: "Cesta Básica", category: "Comida", status: "Aprovado" },
                  { id: 2, name: "Roupas Infantis", category: "Roupas", status: "Pendente" },
                  { id: 3, name: "Utensílios de Cozinha", category: "Casa", status: "Aprovado" },
                  { id: 4, name: "Cobertores", category: "Roupas", status: "Pendente" },
                  { id: 5, name: "Alimentos não perecíveis", category: "Comida", status: "Rejeitado" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[25px_1fr_120px_120px] items-center gap-4 border-b py-3 last:border-0"
                  >
                    <span className="text-muted-foreground">{item.id}</span>
                    <span className="font-medium">{item.name}</span>
                    <span>{item.category}</span>
                    <span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          item.status === "Aprovado"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Pendente"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status === "Aprovado" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {item.status === "Pendente" && <Clock className="mr-1 h-3 w-3" />}
                        {item.status === "Rejeitado" && <XCircle className="mr-1 h-3 w-3" />}
                        {item.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Últimos 5 pedidos registrados na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[25px_1fr_120px_120px] items-center gap-4 border-b pb-2">
                  <span className="font-medium">#</span>
                  <span className="font-medium">Item</span>
                  <span className="font-medium">Solicitante</span>
                  <span className="font-medium">Status</span>
                </div>
                {[
                  { id: 1, name: "Alimentos não perecíveis", requester: "Maria Silva", status: "Aprovado" },
                  { id: 2, name: "Roupas para bebê", requester: "João Santos", status: "Pendente" },
                  { id: 3, name: "Material escolar", requester: "Ana Oliveira", status: "Aprovado" },
                  { id: 4, name: "Medicamentos", requester: "Carlos Pereira", status: "Pendente" },
                  { id: 5, name: "Cobertores", requester: "Juliana Costa", status: "Rejeitado" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[25px_1fr_120px_120px] items-center gap-4 border-b py-3 last:border-0"
                  >
                    <span className="text-muted-foreground">{item.id}</span>
                    <span className="font-medium">{item.name}</span>
                    <span>{item.requester}</span>
                    <span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          item.status === "Aprovado"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Pendente"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status === "Aprovado" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {item.status === "Pendente" && <Clock className="mr-1 h-3 w-3" />}
                        {item.status === "Rejeitado" && <XCircle className="mr-1 h-3 w-3" />}
                        {item.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

