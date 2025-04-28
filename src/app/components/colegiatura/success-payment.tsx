"use client"

import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"

interface SuccessPaymentProps {
  total: number
  onReset: () => void
}

export default function SuccessPayment({ total, onReset }: SuccessPaymentProps) {
  return (
    <Card className="max-w-md mx-auto border-gray-200 shadow-md">
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800">¡Pago Realizado con Éxito!</h2>
        <p className="text-center mt-2 text-gray-700">
          El pago de colegiatura por ${total.toFixed(2)} ha sido procesado correctamente.
        </p>
        <Button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white" onClick={onReset}>
          Realizar otro pago
        </Button>
      </CardContent>
    </Card>
  )
}
