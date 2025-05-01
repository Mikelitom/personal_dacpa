"use client"

import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Printer } from "lucide-react"

interface PaymentReceiptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketData: any
}

export function PaymentReceipt({ open, onOpenChange, ticketData }: PaymentReceiptProps) {
  if (!ticketData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Comprobante de Pago</DialogTitle>
        </DialogHeader>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg">{ticketData.colegio}</h3>
            <p className="text-sm text-gray-600">{ticketData.direccion}</p>
            <p className="text-sm text-gray-600">Tel: {ticketData.telefono}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-3 my-3">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Ticket:</span>
              <span className="font-medium">{ticketData.ticket}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Fecha:</span>
              <span>{ticketData.fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estudiante:</span>
              <span>{ticketData.estudiante}</span>
            </div>
          </div>

          <div className="mb-4">
            {ticketData.meses.map((mes: any, index: number) => {
              const isVencido = mes.estado === "pendiente" && new Date() > new Date(mes.fecha_pago)
              const interes = isVencido ? mes.monto * 0.1 : 0

              return (
                <div key={index} className="mb-2">
                  <div className="flex justify-between font-medium">
                    <span>Colegiatura {mes.concepto}:</span>
                    <span>${mes.monto.toFixed(2)}</span>
                  </div>
                  {interes > 0 && (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Interés (10%):</span>
                      <span>${interes.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${ticketData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>¡Gracias por su pago!</p>
            <p>Este documento es un comprobante de pago válido.</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={() => window.print()} className="bg-pink-600 hover:bg-pink-700">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
