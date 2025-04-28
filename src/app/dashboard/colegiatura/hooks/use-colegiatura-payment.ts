"use client"

import { useState } from "react"
import type { MesColegiatura } from "../types"

export function useColegiaturaPayment(mesesColegiatura: MesColegiatura[]) {
  const [estudiante, setEstudiante] = useState("")
  const [mesesSeleccionados, setMesesSeleccionados] = useState<string[]>([])

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (vencimiento: string) => {
    if (!vencimiento) return false
    const fechaVencimiento = new Date(vencimiento.split("/").reverse().join("-"))
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  // Función para seleccionar/deseleccionar un mes
  const toggleMesSeleccionado = (mesId: string) => {
    const mes = mesesColegiatura.find((m) => m.id === mesId)

    // Si ya hay meses seleccionados, verificar que sean del mismo estudiante
    if (mesesSeleccionados.length > 0) {
      const primerMesId = mesesSeleccionados[0]
      const primerMes = mesesColegiatura.find((m) => m.id === primerMesId)

      if (primerMes && mes && primerMes.estudiante !== mes.estudiante) {
        alert("No se pueden mezclar colegiaturas de diferentes estudiantes en un mismo pago.")
        return
      }

      // Establecer el estudiante automáticamente
      if (mes && !estudiante) {
        setEstudiante(mes.estudiante)
      }
    } else if (mes) {
      // Si es el primer mes seleccionado, establecer el estudiante
      setEstudiante(mes.estudiante)
    }

    if (mesesSeleccionados.includes(mesId)) {
      setMesesSeleccionados(mesesSeleccionados.filter((id) => id !== mesId))
    } else {
      setMesesSeleccionados([...mesesSeleccionados, mesId])
    }
  }

  // Calcular el total a pagar
  const calcularTotal = () => {
    let total = 0
    mesesSeleccionados.forEach((mesId) => {
      const mes = mesesColegiatura.find((m) => m.id === mesId)
      if (mes) {
        total += mes.monto
        // Si ya tiene interés definido, usarlo
        if (mes.interes) {
          total += mes.interes
        }
        // Si está vencido pero no tiene interés definido, calcularlo
        else if (mes.estado === "pendiente" && estaVencido(mes.vencimiento || "")) {
          const interes = mes.monto * 0.1 // 10% de interés
          total += interes
        }
      }
    })
    return total
  }

  return {
    estudiante,
    setEstudiante,
    mesesSeleccionados,
    setMesesSeleccionados,
    toggleMesSeleccionado,
    calcularTotal,
    estaVencido,
  }
}
