'use client'

import { useState } from "react"
import type { Alumno, PagoColegiatura } from "../types"
import { useRouter } from "next/navigation"

interface MercadoPagoOptions {
  alumnos: Alumno[]
  pagos: PagoColegiatura[]
  email?: string
  mesesSeleccionados: string[]
  calcularTotal: () => number
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useMercadoPagoASP({
  alumnos,
  pagos,
  email,
  mesesSeleccionados,
  calcularTotal,
  onSuccess,
  onError,
}: MercadoPagoOptions) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const estaVencido = (fechaPago: string) => {
    if (!fechaPago) return false
    const fechaVencimiento = new Date(fechaPago)
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  const crearPreferencia = async (estudianteId: string) => {
    try {
      setLoading(true)
      setError(null)

      const alumnoId = Number.parseInt(estudianteId)
      const alumno = alumnos.find((a) => a.id_alumno === alumnoId)

      if (!alumno) throw new Error("Estudiante no encontrado")

      const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
      const [nombre, apellido] = [alumno.nombre, `${alumno.apellido_paterno} ${alumno.apellido_materno}`]

      const pago = pagos.find((p) => p.id_colegiatura.toString() === mesesSeleccionados[0])
      if (!pago) throw new Error("Pago no encontrado")

      const isVencido = pago.estado === "pendiente" && estaVencido(pago.fecha_pago)
      const interes = isVencido ? pago.monto * 0.1 : 0
      const montoTotal = pago.monto + interes

      const baseUrl = window.location.origin || "";
      const apiUrl = "https://mercadopagoapidacpa.onrender.com";

      const preferenceData = {
        referenciaExterna: `COL-${Date.now()}-${alumnoId}`,
        concepto: `Colegiatura: ${pago.concepto}${isVencido ? " (incluye interés)" : ""}`,
        cantidad: 1,
        precioUnitario: montoTotal,
        urlExito: `${baseUrl}/dashboard/colegiatura/success`,
        urlFallo: `${baseUrl}/dashboard/colegiatura/failure`,
        urlPendiente: `${baseUrl}/dashboard/colegiatura/pending`,
        nombre,
        apellido,
        currency: "MXN",
        email,
      }

      const response = await fetch(`${apiUrl}/api/pagos/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      })

      if (!response.ok) throw new Error("Error al generar la preferencia")

      const data = await response.json()
      if (onSuccess) onSuccess(data)

      // Redirigir al InitPoint si se desea
      if (data.initPoint) {
        window.location.href = data.initPoint
      }
    } catch (err) {
      setError("Error al crear la preferencia")
      console.error(err)
      if (onError) onError(err)
    } finally {
      setLoading(false)
    }
  }

  return { createPreference: crearPreferencia, loading: loading, error: error }
}