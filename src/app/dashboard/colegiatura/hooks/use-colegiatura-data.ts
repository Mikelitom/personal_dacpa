"use client"

import { useState } from "react"
import { useProfilePage } from "../../hooks/use-profile-page"

export function useColegiatura() {
  const { usuario, padre, alumnos, convenios, pagos, loading } = useProfilePage()

  const [mesesSeleccionados, setMesesSeleccionados] = useState<string[]>([])
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<string>("")
  const [pagado, setPagado] = useState(false)
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (fechaPago: string) => {
    if (!fechaPago) return false
    const fechaVencimiento = new Date(fechaPago)
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  const toggleMesSeleccionado = (mesId: string) => {
    const pago = pagos.find((p) => p.id_colegiatura.toString() === mesId)

    // Si ya hay meses seleccionados, verificar que sean del mismo estudiante
    if (mesesSeleccionados.length > 0) {
      const primerMesId = mesesSeleccionados[0]
      const primerPago = pagos.find((p) => p.id_colegiatura.toString() === primerMesId)

      if (primerPago && pago && primerPago.id_alumno !== pago.id_alumno) {
        alert("No se pueden mezclar colegiaturas de diferentes estudiantes en un mismo pago.")
        return
      }

      // Establecer el estudiante automáticamente
      if (pago && !estudianteSeleccionado) {
        setEstudianteSeleccionado(pago.id_alumno.toString())
      }
    } else if (pago) {
      // Si es el primer mes seleccionado, establecer el estudiante
      setEstudianteSeleccionado(pago.id_alumno.toString())
    }

    if (mesesSeleccionados.includes(mesId)) {
      setMesesSeleccionados(mesesSeleccionados.filter((id) => id !== mesId))
    } else {
      setMesesSeleccionados([...mesesSeleccionados, mesId])
    }
  }

  const calcularTotal = () => {
    let total = 0
    mesesSeleccionados.forEach((mesId) => {
      const pago = pagos.find((p) => p.id_colegiatura.toString() === mesId)
      if (pago) {
        total += pago.monto
        // Si está vencido, calcular interés
        if (pago.estado === "pendiente" && estaVencido(pago.fecha_pago)) {
          const interes = pago.monto * 0.1 // 10% de interés
          total += interes
        }
      }
    })
    return total
  }

  const handlePagoExitoso = (ticketInfo: any) => {
    setTicketData(ticketInfo)
    setTicketDialogOpen(true)

    // Resetear después de mostrar confirmación
    setTimeout(() => {
      setPagado(true)
    }, 500)
  }

  const handleNewPayment = () => {
    setPagado(false)
    setMesesSeleccionados([])
    setEstudianteSeleccionado("")
  }

  return {
    usuario,
    padre,
    alumnos,
    convenios,
    pagos,
    loading,
    mesesSeleccionados,
    estudianteSeleccionado,
    pagado,
    ticketDialogOpen,
    ticketData,
    toggleMesSeleccionado,
    calcularTotal,
    handlePagoExitoso,
    handleNewPayment,
    setTicketDialogOpen,
  }
}
