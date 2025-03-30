"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { ShoppingCart, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"

export default function BooksPage() {
  const { toast } = useToast()
  const [carrito, setCarrito] = useState<{ [key: string]: boolean }>({})
  const [carritoCount, setCarritoCount] = useState(0)

  // Datos de ejemplo para los paquetes de libros
  const paquetes = {
    "1": {
      id: "paq-1",
      grado: "1er Grado",
      precio: 2500,
      libros: [
        { id: "lib-1-1", titulo: "Matemáticas 1", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-1-2", titulo: "Español 1", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-1-3", titulo: "Ciencias Naturales 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
        { id: "lib-1-4", titulo: "Historia 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
        { id: "lib-1-5", titulo: "Geografía 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
        { id: "lib-1-6", titulo: "Inglés 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
      ],
    },
    "2": {
      id: "paq-2",
      grado: "2do Grado",
      precio: 2650,
      libros: [
        { id: "lib-2-1", titulo: "Matemáticas 2", imagen: "/placeholder.svg?height=200&width=150", precio: 480 },
        { id: "lib-2-2", titulo: "Español 2", imagen: "/placeholder.svg?height=200&width=150", precio: 480 },
        { id: "lib-2-3", titulo: "Ciencias Naturales 2", imagen: "/placeholder.svg?height=200&width=150", precio: 420 },
        { id: "lib-2-4", titulo: "Historia 2", imagen: "/placeholder.svg?height=200&width=150", precio: 420 },
        { id: "lib-2-5", titulo: "Geografía 2", imagen: "/placeholder.svg?height=200&width=150", precio: 420 },
        { id: "lib-2-6", titulo: "Inglés 2", imagen: "/placeholder.svg?height=200&width=150", precio: 430 },
      ],
    },
    "3": {
      id: "paq-3",
      grado: "3er Grado",
      precio: 2800,
      libros: [
        { id: "lib-3-1", titulo: "Matemáticas 3", imagen: "/placeholder.svg?height=200&width=150", precio: 500 },
        { id: "lib-3-2", titulo: "Español 3", imagen: "/placeholder.svg?height=200&width=150", precio: 500 },
        { id: "lib-3-3", titulo: "Ciencias Naturales 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-3-4", titulo: "Historia 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-3-5", titulo: "Geografía 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-3-6", titulo: "Inglés 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
      ],
    },
  }

  const agregarAlCarrito = (paqueteId: string) => {
    setCarrito({ ...carrito, [paqueteId]: true })
    setCarritoCount(carritoCount + 1)
    toast({
      title: "Paquete agregado al carrito",
      description: `El paquete de ${paquetes[paqueteId as keyof typeof paquetes].grado} ha sido agregado al carrito.`,
      duration: 3000,
    })
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

      <Tabs defaultValue="1">
        <TabsList className="mb-6">
          <TabsTrigger value="1">1er Grado</TabsTrigger>
          <TabsTrigger value="2">2do Grado</TabsTrigger>
          <TabsTrigger value="3">3er Grado</TabsTrigger>
        </TabsList>

        {Object.keys(paquetes).map((grado) => {
          const paquete = paquetes[grado as keyof typeof paquetes]
          return (
            <TabsContent key={grado} value={grado}>
              <Card>
                <CardHeader>
                  <CardTitle>Paquete de Libros - {paquete.grado}</CardTitle>
                  <CardDescription>Incluye todos los libros necesarios para el ciclo escolar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Precio del paquete completo:</h3>
                      <p className="text-2xl font-bold text-blue-600">${paquete.precio.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Ahorro del 10% comprando el paquete completo</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => agregarAlCarrito(grado)}
                        disabled={carrito[paquete.id]}
                        className="min-w-[150px]"
                      >
                        {carrito[paquete.id] ? (
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
                      {carrito[paquete.id] && (
                        <Link href="/dashboard/carrito">
                          <Button variant="outline">Ver carrito</Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paquete.libros.map((libro) => (
                      <div key={libro.id} className="border rounded-lg p-4 flex flex-col">
                        <div className="relative h-48 mb-4 mx-auto">
                          <Image
                            src={libro.imagen || "/placeholder.svg"}
                            alt={libro.titulo}
                            width={150}
                            height={200}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="font-medium">{libro.titulo}</h3>
                        <p className="text-gray-500 text-sm mb-2">Edición 2024</p>
                        <p className="font-bold mt-auto">${libro.precio.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-sm">Los libros solo se venden en paquete completo</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      {paquete.libros.length} libros
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
      <Toaster />
    </div>
  )
}
