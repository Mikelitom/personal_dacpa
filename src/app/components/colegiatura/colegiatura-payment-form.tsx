"use client"

import { AlertCircle, DollarSign } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { MesColegiatura, EstudianteUI } from "../types"

interface ColegiaturaPaymentFormProps {
  mesesSeleccionados: string[]
  estudiante: string
  estudiantes: EstudianteUI[]
  mesesColegiatura: MesColegiatura[]
  calcularTotal: () => number
  estaVencido: (vencimiento: string) => boolean
  onPagoExitoso: () => void
}

export default function ColegiaturaPaymentForm({
  mesesSeleccionados,
  estudiante,
  estudiantes,
  mesesColegiatura,
  calcularTotal,
  estaVencido,
  onPagoExitoso,
}: ColegiaturaPaymentFormProps) {
  return (
    <Card className="border-gray-200 shadow-md mt-6">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-pink-500" />
          Realizar Pago
        </CardTitle>
        <CardDescription className="text-gray-600">Completa la información para procesar tu pago</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Resumen del pago */}
        {mesesSeleccionados.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-700">Resumen del Pago</Label>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              {estudiante && (
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <p className="font-medium text-gray-800">
                    Estudiante: {estudiantes.find((e) => e.id === estudiante)?.nombre}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {mesesSeleccionados.map((mesId) => {
                  const mes = mesesColegiatura.find((m) => m.id === mesId)
                  if (!mes) return null

                  const isVencido = mes.estado === "pendiente" && estaVencido(mes.vencimiento || "")
                  const interesCalculado = isVencido && !mes.interes ? mes.monto * 0.1 : mes.interes || 0

                  return (
                    <div key={mesId}>
                      <div className="flex justify-between items-center text-gray-800">
                        <span>Colegiatura {mes.nombre}</span>
                        <span className="font-medium">${mes.monto.toFixed(2)}</span>
                      </div>
                      {interesCalculado > 0 && (
                        <div className="flex justify-between items-center text-red-500 text-sm">
                          <span>+ Interés por pago tardío (10%)</span>
                          <span className="font-medium">${interesCalculado.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-gray-800">
                  <span>Total a pagar:</span>
                  <span className="text-lg">${calcularTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                Para solicitar factura, envíe un correo a <span className="font-medium">facturacion@colegio.edu</span>{" "}
                con su comprobante de pago y datos fiscales.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
        <Button
          className="w-full bg-pink-600 hover:bg-pink-700"
          onClick={onPagoExitoso}
          disabled={mesesSeleccionados.length === 0}
        >
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 256 256" className="h-5 w-5 mr-2">
              <path
                d="M216.2,94.4l-32.7,32.7,13.1,13.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0l-13.1-13.1-17.4,17.4,26.2,26.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0L143.6,167l-17.4,17.4,13.1,13.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0l-13.1-13.1L82.2,228.4a28,28,0,0,1-39.6-39.6L76.3,155l-13-13a8,8,0,0,1,11.3-11.3l13.1,13.1L105,126.4,78.9,100.2a8,8,0,0,1,11.3-11.3l26.1,26.2,17.4-17.4L120.6,84.6a8,8,0,0,1,11.3-11.3l13.1,13.1,32.7-32.7a28,28,0,0,1,39.6,39.6ZM54,200.1a12,12,0,1,0,17,0A12,12,0,0,0,54,200.1Z"
                fill="#ffffff"
              />
            </svg>
            <span className="text-white">Pagar con Mercado Pago: ${calcularTotal().toFixed(2)}</span>
          </div>
        </Button>
      </CardFooter>
    </Card>
  )
}
