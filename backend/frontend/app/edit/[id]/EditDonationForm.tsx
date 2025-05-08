"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  onSuccess: () => void
}

export function EditDonationForm({ onSuccess }: Props) {
  const { id } = useParams()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("")
  const [categoryId, setCategoryId] = useState("1")
  const [documents, setDocuments] = useState<string[]>([])
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonation = async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/donations/${id}`)
      if (!res.ok) return
      const data = await res.json()
      setTitle(data.title)
      setDescription(data.description)
      setContact(data.contact)
      setCategoryId(data.category_id.toString())
      try {
        const parsed = JSON.parse(data.document)
        setDocuments(Array.isArray(parsed) ? parsed : [parsed])
      } catch {
        setDocuments(data.document ? [data.document] : [])
      }
      setLoading(false)
    }
    fetchDonation()
  }, [id])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    if (documents.length + fileArray.length > 6) {
      toast({
        title: "Limite de imagens atingido",
        description: "Só pode adicionar até 6 imagens.",
        variant: "destructive",
      })
      return
    }

    const base64Promises = fileArray.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    Promise.all(base64Promises).then((newImages) => {
      setDocuments((prev) => [...prev, ...newImages])
    })
    e.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setImageError(false)

    if (documents.length === 0) {
      setImageError(true)
      return
    }

    const token = localStorage.getItem("auth_token")
    if (!token) return

    const res = await fetch(`http://127.0.0.1:8000/api/donations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        contact,
        category_id: parseInt(categoryId),
        document: JSON.stringify(documents),
        status_id: 1,
      }),
    })

    if (res.ok) {
      onSuccess() // chama o popup de sucesso da página principal
    }
  }

  if (loading) return <p>A carregar...</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <RadioGroup value={categoryId} onValueChange={setCategoryId}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="food" />
            <Label htmlFor="food">Comida</Label>
            <RadioGroupItem value="2" id="clothing" />
            <Label htmlFor="clothing">Roupas</Label>
            <RadioGroupItem value="3" id="household" />
            <Label htmlFor="household">Itens para Casa</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contacto</Label>
        <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label>Imagens *</Label>
        <div
          className={`border-2 border-dashed p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer ${imageError ? 'border-red-500' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm">Clique para selecionar imagem</p>
          {documents.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mt-2">
                {documents.length} imagem(ns) selecionada(s)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2 w-full">
                {documents.map((src, index) => (
                  <div key={index} className="relative group border rounded-lg overflow-hidden">
                    <img
                      src={src}
                      alt={`Imagem ${index + 1}`}
                      className="object-cover h-32 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDocuments(prev => prev.filter((_, i) => i !== index))
                      }}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                      title="Remover imagem"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {imageError && (
          <p className="text-xs text-red-600">É obrigatório adicionar pelo menos uma imagem.</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

      <Button type="submit" className="w-full">Guardar Alterações</Button>
    </form>
  )
}
