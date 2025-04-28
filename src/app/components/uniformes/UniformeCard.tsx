// components/UniformeCard.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { AlertCircle, ShoppingCart, Check, Plus, Minus } from "lucide-react"

interface Uniforme {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  categoria: string
  tallas: string[]
  stock: Record<string, number>
}

interface UniformeCardProps {
  uniforme: Uniforme
  tallaSeleccionada: string
  cantidad: number
  carrito: { [key: string]: boolean }
  onTallaChange: (id: string, talla: string) => void
  onIncrementarCantidad: (id: string) => void
  onDecrementarCantidad: (id: string) => void
  onCantidadChange: (id: string, cantidad: number) => void
  onAgregarAlCarrito: (id: string) => void
}

export function UniformeCard({
  uniforme,
  tallaSeleccionada,
  cantidad,
  carrito,
  onTallaChange,
  onIncrementarCantidad,
  onDecrementarCantidad,
  onCantidadChange,
  onAgregarAlCarrito,
}: UniformeCardProps) {
  const sinStock = tallaSeleccionada ? uniforme.stock[tallaSeleccionada] === 0 : false

  const renderStockBadge = () => {
    if (!tallaSeleccionada) return null

    const stockTalla = uniforme.stock[tallaSeleccionada]

    if (stockTalla === 0) {
      return <Badge variant="destructive">Sin existencias</Badge>
    } else if (stockTalla <= 3) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pocas existencias</Badge>
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">En existencia</Badge>
    }
  }

  return (
    <Card className="border-none shadow-md overflow-hidden h-full">
      <CardHeader className="pb-2 bg-gradient-to-r from-pink-50 to-white border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{uniforme.nombre}</CardTitle>
            <CardDescription>{uniforme.descripcion}</CardDescription>
          </div>
          <div>{renderStockBadge()}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative h-64 w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg p-4">
            <Image src={uniforme.imagen} alt={uniforme.nombre} width={250} height={300} className="object-contain max-h-full" />
            <Badge className="absolute top-2 right-2 bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200">
              {uniforme.categoria === "diario" ? "Uniforme Diario" : uniforme.categoria === "deportivo" ? "Deportivo" : "Gala"}
            </Badge>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-2xl font-bold text-pink-600">${uniforme.precio.toFixed(2)}</p>

            <div className="space-y-2">
              <Label>Talla</Label>
              <Select value={tallaSeleccionada || ""} onValueChange={(value) => onTallaChange(uniforme.id, value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Seleccionar talla" />
                </SelectTrigger>
                <SelectContent>
                  {uniforme.tallas.map((talla) => (
                    <SelectItem key={talla} value={talla}>
                      {talla} {uniforme.stock[talla] === 0 ? " - Sin existencias" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tallaSeleccionada && sinStock && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-amber-700 text-sm">Esta talla no está disponible actualmente.</p>
                  </div>
                </div>
              </div>
            )}

            {tallaSeleccionada && !sinStock && (
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={() => onDecrementarCantidad(uniforme.id)} disabled={cantidad <= 1} className="border-pink-200 text-pink-700 hover:bg-pink-50">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    className="w-16 mx-2 text-center bg-white"
                    value={cantidad}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value)
                      if (val > 0) {
                        onCantidadChange(uniforme.id, val)
                      }
                    }}
                    min={1}
                  />
                  <Button variant="outline" size="icon" onClick={() => onIncrementarCantidad(uniforme.id)} className="border-pink-200 text-pink-700 hover:bg-pink-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="w-full flex justify-end gap-2">
          {tallaSeleccionada && (
            <>
              <Button onClick={() => onAgregarAlCarrito(uniforme.id)} disabled={carrito[uniforme.id] || sinStock} className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300">
                {carrito[uniforme.id] ? (
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
              {carrito[uniforme.id] && (
                <Link href="/dashboard/carrito">
                  <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                    Ver carrito
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
