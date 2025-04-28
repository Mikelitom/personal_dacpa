"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { ShoppingCart, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"
import { Articulo } from "../types"

export default function BooksPage() {
  const { toast } = useToast()

  const [libros, setLibros] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [carrito, setCarrito] = useState<{ [key: number]: boolean }>({})
  const [carritoCount, setCarritoCount] = useState(0)

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/articulos/Libros') // endpoint que trae todos los artículos

        if (!response.ok) {
          throw new Error('Error al cargar artículos.')
        }

        const data: Articulo[] = await response.json()

        // Filtramos solo los que correspondan a libros (por categoría o por otra lógica)
        const librosFiltrados = data.filter(a => a.categoria.toLowerCase().includes('libro'))

        setLibros(librosFiltrados)
      } catch (error: any) {
        setError(error.message)
        toast({
          title: 'Error al cargar libros',
          description: 'No pudimos cargar el catálogo de libros. Por favor, intenta más tarde.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLibros()
  }, [toast])

  const agregarAlCarrito = (id_articulo: number, nombre: string) => {
    setCarrito(prev => ({ ...prev, [id_articulo]: true }))
    setCarritoCount(prev => prev + 1)

    toast({
      title: "Libro agregado",
      description: `Has agregado "${nombre}" al carrito.`,
      duration: 3000,
    })
  }

  const grados = ["1er Grado", "2do Grado", "3er Grado"]

  // Aquí tú puedes tener alguna lógica para clasificar libros por grado basado en el nombre, sku, etc.
  const filtrarPorGrado = (libros: Articulo[], grado: string) => {
    if (grado.includes("1er")) {
      return libros.filter(l => l.nombre.toLowerCase().includes("1"))
    }
    if (grado.includes("2do")) {
      return libros.filter(l => l.nombre.toLowerCase().includes("2"))
    }
    if (grado.includes("3er")) {
      return libros.filter(l => l.nombre.toLowerCase().includes("3"))
    }
    return []
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Libros Escolares</h1>

        <Link href="/dashboard/carrito">
          <Button variant="outline" className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ver carrito
            {carritoCount > 0 && (
              <Badge variant="default" className="ml-2">
                {carritoCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="1er Grado">
        <TabsList className="mb-6">
          {grados.map(grado => (
            <TabsTrigger key={grado} value={grado}>
              {grado}
            </TabsTrigger>
          ))}
        </TabsList>

        {grados.map(grado => (
          <TabsContent key={grado} value={grado}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrarPorGrado(libros, grado).map(libro => (
                <Card key={libro.id_articulo} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{libro.nombre}</CardTitle>
                    <CardDescription>{libro.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={libro.imagen_url || "/placeholder.svg"}
                        alt={libro.nombre}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <p className="text-blue-600 text-xl font-bold">${libro.precio_venta.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      onClick={() => agregarAlCarrito(libro.id_articulo, libro.nombre)}
                      disabled={carrito[libro.id_articulo]}
                      className="w-full"
                    >
                      {carrito[libro.id_articulo] ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Agregado
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Agregar al carrito
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Toaster />
    </div>
  )
}