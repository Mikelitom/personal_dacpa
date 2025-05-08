"use client"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import { AlertCircle, DollarSign } from "lucide-react"
import type { Alumno, PagoColegiatura } from "../../types"
import { useMercadoPago } from "../../hooks/use-mercado-pago"
import { useState } from "react"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { useMercadoPagoASP } from "../../hooks/use-mercado-pago-asp"

interface PaymentFormProps {
  alumnos: Alumno[]
  pagos: PagoColegiatura[]
  email?: string
  mesesSeleccionados: string[]
  calcularTotal: () => number
  onPagoExitoso: (ticketInfo: any) => void
  estudianteSeleccionado: string
}

export function PaymentForm({
  alumnos,
  pagos,
  email,
  mesesSeleccionados,
  calcularTotal,
  onPagoExitoso,
  estudianteSeleccionado,
}: PaymentFormProps) {
  const [processingPayment, setProcessingPayment] = useState(false)

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (fechaPago: string) => {
    if (!fechaPago) return false
    const fechaVencimiento = new Date(fechaPago)
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  const { createPreference, loading, error } = useMercadoPagoASP({
    alumnos,
    pagos,
    mesesSeleccionados,
    email,
    calcularTotal,
    onSuccess: (data) => {
      console.log("Preferencia creada exitosamente:", data)
      // No llamamos a onPagoExitoso aquí porque el usuario será redirigido a Mercado Pago
    },
    onError: (err) => {
      console.error("Error al crear preferencia:", err)
      setProcessingPayment(false)
    },
  })

  const handlePagoMercadoPago = async () => {
    if (!estudianteSeleccionado || mesesSeleccionados.length === 0) {
      return
    }

    setProcessingPayment(true)
    await createPreference(estudianteSeleccionado)
    // Si llegamos aquí, es porque hubo un error (de lo contrario, se habría redirigido)
    setProcessingPayment(false)
  }

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
              {estudianteSeleccionado && (
                <div className="mb-3 pb-2 border-b border-gray-200">
                  {alumnos.map((alumno) => {
                    if (alumno.id_alumno.toString() === estudianteSeleccionado) {
                      const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
                      return (
                        <p key={alumno.id_alumno} className="font-medium text-gray-800">
                          Estudiante: {nombreCompleto}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>
              )}
              <div className="space-y-2">
                {mesesSeleccionados.map((mesId) => {
                  const pago = pagos.find((p) => p.id_colegiatura.toString() === mesId)
                  if (!pago) return null

                  const isVencido = pago.estado === "pendiente" && estaVencido(pago.fecha_pago)
                  const interes = isVencido ? pago.monto * 0.1 : 0

                  return (
                    <div key={mesId}>
                      <div className="flex justify-between items-center text-gray-800">
                        <span>Colegiatura {pago.concepto}</span>
                        <span className="font-medium">${pago.monto.toFixed(2)}</span>
                      </div>
                      {interes > 0 && (
                        <div className="flex justify-between items-center text-red-500 text-sm">
                          <span>+ Interés por pago tardío (10%)</span>
                          <span className="font-medium">${interes.toFixed(2)}</span>
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

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Error al procesar el pago: {error}. Por favor, intenta nuevamente o contacta a soporte.
            </AlertDescription>
          </Alert>
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
          onClick={handlePagoMercadoPago}
          disabled={mesesSeleccionados.length === 0 || loading || processingPayment}
        >
          <div className="flex items-center justify-center">
            {loading || processingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="text-white">Procesando...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 256 256" className="h-5 w-5 mr-2">
                  <path
                    d="M216.2,94.4l-32.7,32.7,13.1,13.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0l-13.1-13.1-17.4,17.4,26.2,26.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0L143.6,167l-17.4,17.4,13.1,13.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0l-13.1-13.1L82.2,228.4a28,28,0,0,1-39.6-39.6L76.3,155l-13-13a8,8,0,0,1,11.3-11.3l13.1,13.1L105,126.4,78.9,100.2a8,8,0,0,1,11.3-11.3l26.1,26.2,17.4-17.4L120.6,84.6a8,8,0,0,1,11.3-11.3l13.1,13.1,32.7-32.7a28,28,0,0,1,39.6,39.6ZM54,200.1a12,12,0,1,0,17,0A12,12,0,0,0,54,200.1Z"
                    fill="#ffffff"
                  />
                </svg>
                <span className="text-white">Pagar con Mercado Pago: ${calcularTotal().toFixed(2)}</span>
              </>
            )}
          </div>
        </Button>
      </CardFooter>
    </Card>
  )
}
