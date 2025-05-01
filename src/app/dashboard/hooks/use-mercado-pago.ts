"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Alumno, PagoColegiatura } from "../types"

interface MercadoPagoOptions {
  alumnos: Alumno[]
  pagos: PagoColegiatura[]
  mesesSeleccionados: string[]
  calcularTotal: () => number
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useMercadoPago({
  alumnos,
  pagos,
  mesesSeleccionados,
  calcularTotal,
  onSuccess,
  onError,
}: MercadoPagoOptions) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (fechaPago: string) => {
    if (!fechaPago) return false
    const fechaVencimiento = new Date(fechaPago)
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  const createPreference = async (estudianteId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Obtener información del estudiante
      const alumnoId = Number.parseInt(estudianteId)
      const alumno = alumnos.find((a) => a.id_alumno === alumnoId)

      if (!alumno) {
        throw new Error("Estudiante no encontrado")
      }

      const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

      // Preparar items para Mercado Pago
      const items = mesesSeleccionados
        .map((mesId) => {
          const pago = pagos.find((p) => p.id_colegiatura.toString() === mesId)
          if (!pago) return null

          const isVencido = pago.estado === "pendiente" && estaVencido(pago.fecha_pago)
          const interes = isVencido ? pago.monto * 0.1 : 0
          const montoTotal = pago.monto + interes

          return {
            id: pago.id_colegiatura.toString(),
            title: `Colegiatura: ${pago.concepto}${isVencido ? " (incluye interés)" : ""}`,
            description: `Pago de colegiatura para ${nombreCompleto}`,
            quantity: 1,
            currency_id: "MXN", // Ajusta según tu moneda
            unit_price: montoTotal,
          }
        })
        .filter(Boolean)

      // Crear referencia externa única
      const externalReference = `COL-${Date.now()}-${alumnoId}`

      // Obtener la URL base del sitio
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
      console.log("baseurl: ", baseUrl)

      // Preparar datos para la API
      const preferenceData = {
        items,
        payer: {
          name: alumno.nombre,
          surname: `${alumno.apellido_paterno} ${alumno.apellido_materno}`,
        },
        external_reference: externalReference,
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        back_urls: {
          success: `${baseUrl}/colegiatura/success?reference=${externalReference}`,
          failure: `${baseUrl}/colegiatura/failure?reference=${externalReference}`,
          pending: `${baseUrl}/colegiatura/pending?reference=${externalReference}`,
        },
      }

      console.log("Enviando datos de preferencia:", preferenceData)

      // Llamar a nuestra API para crear la preferencia
      const response = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear preferencia de pago")
      }

      const data = await response.json()
      console.log("Respuesta de la API:", data)

      // Guardar información del pago en localStorage para recuperarla después
      localStorage.setItem(
        `payment_${externalReference}`,
        JSON.stringify({
          items,
          total: calcularTotal(),
          estudiante: nombreCompleto,
          grado: `${alumno.grado}${alumno.grupo}`,
          fecha: new Date().toISOString(),
          mesesIds: mesesSeleccionados,
        }),
      )

      // Redirigir al usuario a la página de pago de Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        throw new Error("No se recibió la URL de pago de Mercado Pago")
      }

      if (onSuccess) {
        onSuccess(data)
      }

      return data
    } catch (err: any) {
      console.error("Error al crear preferencia:", err)
      setError(err.message || "Error al procesar el pago")

      if (onError) {
        onError(err)
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createPreference,
    loading,
    error,
  }
}
