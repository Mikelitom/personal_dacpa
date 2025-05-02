"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Separator } from "@/app/components/ui/separator"
import { ShoppingCart, CreditCard, Trash2, CheckCircle2, ArrowLeft, Plus, Minus, Loader2 } from "lucide-react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"
import useCart from "@/app/dashboard/carrito/hooks/useCart"
import { useProfilePage } from "../hooks/use-profile-page"
import { useMercadoPagoCarrito } from "../hooks/use-mercado-pago-carrito"
import type { Alumno } from "../types"

export default function CarritoPage() {
  const { toast } = useToast()
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart()
  const [alumno, setAlumno] = useState<Alumno | undefined>(undefined)
  const [completado, setCompletado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  const { alumnos } = useProfilePage()

  // Simulamos el tiempo de carga
  useEffect(() => {
    setTimeout(() => {
      setCargando(false)
    }, 500)
  }, [])

  // Calculamos el total del carrito
  const calcularTotal = () => {
    return cart.reduce((total, item) => total + item.precio_venta * item.cantidad, 0)
  }

  const { createPreference, loading, error } = useMercadoPagoCarrito({
    alumno,
    cart,
    calcularTotal,
    onSuccess: (data) => {
      console.log("Preferencia creada exitosamente:", data)
      // No llamamos a onPagoExitoso aquí porque el usuario será redirigido a Mercado Pago
    },
    onError: (err) => {
      console.error("Error al crear preferencia:", err)
      toast({
        title: "Error al procesar el pago",
        description: err.message || "Ocurrió un error al procesar el pago",
        variant: "destructive",
      })
      setProcessingPayment(false)
    },
  })

  const handlePagoMercadoPago = async () => {
    if (!alumno) {
      toast({
        title: "Selecciona un alumno",
        description: "Por favor selecciona un alumno para continuar con el pago",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "No hay productos en el carrito para procesar el pago",
        variant: "destructive",
      })
      return
    }

    setProcessingPayment(true)
    await createPreference()
    // Si llegamos aquí, es porque hubo un error (de lo contrario, se habría redirigido)
    setProcessingPayment(false)
  }

  if (cargando) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (completado) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-center">¡Compra Realizada con Éxito!</h2>
            <p className="text-center mt-2">
              Tu pedido ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
              <Link href="/dashboard/estado-cuenta">
                <Button>Ver mis compras</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

      {cart.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="pt-6 flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-center">Tu carrito está vacío</h2>
            <p className="text-center mt-2 text-gray-500">No tienes productos en tu carrito de compras.</p>
            <div className="mt-6 flex gap-4">
              <Link href="/dashboard/productos/libros">
                <Button variant="outline">Ver libros</Button>
              </Link>
              <Link href="/dashboard/productos/uniformes">
                <Button>Ver uniformes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-gray-50">
          {/* Lista de productos */}
          <div className="lg:col-span-2 border-gray-200">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({cart.length})</CardTitle>
                <CardDescription>Revisa los productos en tu carrito antes de continuar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 border-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.id_articulo}
                      className="flex items-center space-x-4 py-2 border-b last:border-0 border-gray-200"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0">
                        {/* <Image
                          src={item.imagen_url || "/placeholder.svg"}
                          alt={item.nombre}
                          width={80}
                          height={80}
                          className="object-contain"
                        /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{item.nombre}</h3>
                        <p className="font-bold">${item.precio_venta.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id_articulo, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id_articulo, item.cantidad + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id_articulo)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Vaciar carrito
                </Button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-2xl font-bold">${calcularTotal().toFixed(2)}</p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Resumen y pago */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alumno">Asignar a alumno</Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedAlumno = alumnos.find((a) => a.id_alumno.toString() === value)
                      setAlumno(selectedAlumno)
                    }}
                  >
                    <SelectTrigger id="alumno">
                      <SelectValue placeholder="Seleccionar alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {alumnos?.map((est) => (
                        <SelectItem key={est.id_alumno} value={est.id_alumno.toString()}>
                          {est.nombre} - {est.grado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Proceder a pago</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handlePagoMercadoPago} disabled={processingPayment || loading}>
                  {processingPayment || loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagar ${calcularTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}
