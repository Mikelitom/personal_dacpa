"use client"

import { useState, useMemo } from "react"
import type { MesColegiatura } from "../types"

export function useColegiaturaFilters(mesesColegiatura: MesColegiatura[]) {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroEstudiante, setFiltroEstudiante] = useState("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (vencimiento: string) => {
    if (!vencimiento) return false
    const fechaVencimiento = new Date(vencimiento.split("/").reverse().join("-"))
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  // Filtrar meses según los criterios seleccionados
  const mesesFiltrados = useMemo(() => {
    return mesesColegiatura.filter((mes) => {
      // Filtro por búsqueda
      if (busqueda) {
        const searchLower = busqueda.toLowerCase()
        const matchesNombre = mes.nombre.toLowerCase().includes(searchLower)
        const matchesEstudiante = mes.nombreEstudiante.toLowerCase().includes(searchLower)
        if (!matchesNombre && !matchesEstudiante) return false
      }

      // Filtro por estado
      if (filtroEstado !== "todos") {
        if (filtroEstado === "vencido") {
          if (!(mes.estado === "pendiente" && estaVencido(mes.vencimiento || ""))) return false
        } else if (mes.estado !== filtroEstado) {
          return false
        }
      }

      // Filtro por estudiante
      if (filtroEstudiante !== "todos" && mes.estudiante !== filtroEstudiante) return false

      // Filtro por periodo
      if (filtroPeriodo === "verano" && (mes.nombre === "Junio" || mes.nombre === "Julio")) return true
      if (filtroPeriodo === "regular" && mes.nombre !== "Junio" && mes.nombre !== "Julio") return true
      if (filtroPeriodo !== "todos" && filtroPeriodo !== "verano" && filtroPeriodo !== "regular") return false

      return true
    })
  }, [mesesColegiatura, busqueda, filtroEstado, filtroEstudiante, filtroPeriodo])

  return {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroEstudiante,
    setFiltroEstudiante,
    filtroPeriodo,
    setFiltroPeriodo,
    mesesFiltrados,
    estaVencido,
  }
}
