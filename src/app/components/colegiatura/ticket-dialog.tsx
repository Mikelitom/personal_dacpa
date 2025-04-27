"use client"

import { Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { TicketData } from "../types"

interface TicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketData: TicketData | null
  estaVencido: (vencimiento: string) => boolean
}

export default function TicketDialog({ open, onOpenChange, ticketData, estaVencido }: TicketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Comprobante de Pago</DialogTitle>
        </DialogHeader>
        {ticketData && (
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
              {ticketData.meses.map((mes, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between font-medium">
                    <span>Colegiatura {mes.nombre}:</span>
                    <span>${mes.monto.toFixed(2)}</span>
                  </div>
                  {(mes.interes || (mes.estado === "pendiente" && estaVencido(mes.vencimiento || ""))) && (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Interés (10%):</span>
                      <span>${(mes.interes || mes.monto * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              ))}
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
        )}
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
