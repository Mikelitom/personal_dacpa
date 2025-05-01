"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { CheckCircle2, Printer } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const reference = searchParams.get("reference")
    if (!reference) {
      router.push("/colegiatura")
      return
    }

    // Recuperar datos del pago del localStorage
    const storedData = localStorage.getItem(`payment_${reference}`)
    if (storedData) {
      setPaymentData(JSON.parse(storedData))

      // Opcional: Limpiar el localStorage después de recuperar los datos
      // localStorage.removeItem(`payment_${reference}`)
    }

    // Aquí podrías hacer una llamada a tu API para verificar el estado del pago
    // y actualizar la base de datos si es necesario

    setLoading(false)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Card className="max-w-md mx-auto border-gray-200 shadow-md">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800">¡Pago Realizado con Éxito!</h2>
            <p className="text-center mt-2 text-gray-700">
              Tu pago ha sido procesado correctamente, pero no pudimos recuperar los detalles.
            </p>
            <Button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white" asChild>
              <Link href="/colegiatura">Volver a Colegiaturas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-md mx-auto border-gray-200 shadow-md">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800">¡Pago Realizado con Éxito!</h2>
          <p className="text-center mt-2 text-gray-700">
            El pago de colegiatura por ${paymentData.total.toFixed(2)} ha sido procesado correctamente.
          </p>

          {/* Comprobante de pago */}
          <div className="w-full mt-6 p-4 border border-gray-200 rounded-lg">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">Colegio Ejemplo</h3>
              <p className="text-sm text-gray-600">Av. Principal #123, Ciudad</p>
              <p className="text-sm text-gray-600">Tel: 555-123-4567</p>
            </div>

            <div className="border-t border-b border-gray-200 py-3 my-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Ticket:</span>
                <span className="font-medium">TICK-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Fecha:</span>
                <span>{new Date(paymentData.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estudiante:</span>
                <span>{paymentData.estudiante}</span>
              </div>
            </div>

            <div className="mb-4">
              {paymentData.items.map((item: any, index: number) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between font-medium">
                    <span>{item.title}:</span>
                    <span>${item.unit_price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${paymentData.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>¡Gracias por su pago!</p>
              <p>Este documento es un comprobante de pago válido.</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6 w-full">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/colegiatura">Volver</Link>
            </Button>
            <Button className="flex-1 bg-pink-600 hover:bg-pink-700" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
