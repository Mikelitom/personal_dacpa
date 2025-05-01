"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"

export default function PaymentPendingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const reference = searchParams.get("reference")
    if (!reference) {
      router.push("/colegiatura")
    }

    // Aquí podrías hacer una llamada a tu API para registrar el pago pendiente
  }, [searchParams, router])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-md mx-auto border-gray-200 shadow-md">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800">Pago en Proceso</h2>
          <p className="text-center mt-2 text-gray-700">
            Tu pago está siendo procesado. Te notificaremos cuando se complete la transacción.
          </p>
          <Button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white" asChild>
            <Link href="/colegiatura">Volver a Colegiaturas</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
