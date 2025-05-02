"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Alumno, ArticuloConCantidad } from "@/app/dashboard/types"

interface MercadoPagoOptions {
  cart: ArticuloConCantidad[] // Cambiado de productos a cart para consistencia
  alumno: Alumno | undefined
  calcularTotal: () => number
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useMercadoPagoCarrito({
  alumno,
  cart, // Cambiado de productos a cart
  calcularTotal,
  onSuccess,
  onError,
}: MercadoPagoOptions) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crear preferencia para el pago de productos en el carrito
  const createPreference = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!alumno) {
        throw new Error("Debe seleccionar un alumno para continuar")
      }

      // Preparar items para Mercado Pago desde los productos del carrito
      const items = cart.map((producto) => ({
        id: producto.id_articulo.toString(),
        title: producto.nombre,
        description: `Compra de ${producto.nombre}`,
        quantity: producto.cantidad || 1,
        currency_id: "MXN", // Ajusta según tu moneda
        unit_price: producto.precio_venta,
      }))

      // Crear referencia externa única
      const externalReference = `CART-${Date.now()}`

      // Obtener la URL base del sitio
      const baseUrl = window.location.origin

      // Preparar datos para la API
      const preferenceData = {
        items,
        payer: {
          name: alumno?.nombre || "Cliente",
          surname: `${alumno?.apellido_paterno || ""} ${alumno?.apellido_materno || ""}`.trim() || "Apellido",
        },
        external_reference: externalReference,
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        back_urls: {
          success: `${baseUrl}/dashboard/carrito/success?reference=${externalReference}`,
          failure: `${baseUrl}/dashboard/carrito/failure?reference=${externalReference}`,
          pending: `${baseUrl}/dashboard/carrito/pending?reference=${externalReference}`,
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
          fecha: new Date().toISOString(),
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
