"use client"

import { useState, useEffect } from "react"
import { Card } from "@/app/components/ui/card"
import ColegiaturaHeader from "@/app/components/colegiatura/colegiatura-header"
import ColegiaturaFilters from "@/app/components/colegiatura/colegiatura-filters"
import ColegiaturaList from "@/app/components/colegiatura/colegiatura-list"
import ColegiaturaPaymentForm from "@/app/components/colegiatura/colegiatura-payment-form"
import ColegiaturaResumen from "@/app/components/colegiatura/colegiatura-resumen"
import SuccessPayment from "@/app/components/colegiatura/success-payment"
import TicketDialog from "@/app/components/colegiatura/ticket-dialog"
import { useColegiaturaData } from "./hooks/use-colegiatura-data"
import { useColegiaturaFilters } from "./hooks/use-colegiatura-filters"
import { useColegiaturaPayment } from "./hooks/use-colegiatura-payment"
import type { MesColegiatura, TicketData } from './types';

export default function ColegiaturaPage() {
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [pagado, setPagado] = useState(false)

  // Hooks personalizados para manejar los datos y la lógica
  const { estudiantes, mesesColegiatura, convenios, isLoading } = useColegiaturaData()

  const {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroEstudiante,
    setFiltroEstudiante,
    filtroPeriodo,
    setFiltroPeriodo,
    mesesFiltrados,
  } = useColegiaturaFilters(mesesColegiatura)

  const {
    estudiante,
    setEstudiante,
    mesesSeleccionados,
    setMesesSeleccionados,
    toggleMesSeleccionado,
    calcularTotal,
    estaVencido,
  } = useColegiaturaPayment(mesesColegiatura)

  // Efecto para establecer el estudiante cuando cambia el filtro
  useEffect(() => {
    if (filtroEstudiante !== "todos" && filtroEstudiante !== "") {
      setEstudiante(filtroEstudiante)
    }
  }, [filtroEstudiante, setEstudiante])

  // Manejador para procesar el pago exitoso
  const handlePagoExitoso = () => {
    // Crear datos del ticket
    const estudianteInfo = estudiantes.find((est: { id_alumno: { toString: () => any } }) => est.id_alumno.toString() === estudiante)
    const mesesInfo = mesesSeleccionados
      .map((mesId: any) => {
        const mes = mesesColegiatura.find((m: { id: any }) => m.id === mesId)
        return mes
      })
      .filter(Boolean)

    const ticketInfo: TicketData = {
      fecha: new Date().toLocaleDateString(),
      estudiante: estudianteInfo
        ? `${estudianteInfo.nombre} ${estudianteInfo.apellido_paterno} ${estudianteInfo.apellido_materno}`
        : "",
      grado: estudianteInfo?.grado || "",
      meses: mesesInfo as MesColegiatura[],
      total: calcularTotal(),
      ticket: `TICK-${Date.now().toString().slice(-6)}`,
      colegio: "Colegio Ejemplo",
      direccion: "Av. Principal #123, Ciudad",
      telefono: "555-123-4567",
    }

    setTicketData(ticketInfo)
    setTicketDialogOpen(true)

    // Resetear después de mostrar confirmación
    setTimeout(() => {
      setPagado(true)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando información de colegiaturas...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pago de Colegiatura</h1>

      {pagado ? (
        <SuccessPayment total={calcularTotal()} onReset={() => setPagado(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen de pagos */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ColegiaturaResumen convenios={convenios} mesesColegiatura={mesesColegiatura} estaVencido={estaVencido} />
          </div>

          {/* Lista de meses */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="border-gray-200 shadow-md">
              <ColegiaturaHeader />

              {/* Filtros */}
              <ColegiaturaFilters
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                filtroEstudiante={filtroEstudiante}
                setFiltroEstudiante={setFiltroEstudiante}
                filtroPeriodo={filtroPeriodo}
                setFiltroPeriodo={setFiltroPeriodo}
                estudiantes={estudiantes}
              />

              <ColegiaturaList
                mesesFiltrados={mesesFiltrados}
                estudiantes={estudiantes}
                filtroEstudiante={filtroEstudiante}
                mesesSeleccionados={mesesSeleccionados}
                toggleMesSeleccionado={toggleMesSeleccionado}
                estaVencido={estaVencido}
                calcularTotal={calcularTotal}
              />
            </Card>

            {/* Formulario de pago */}
            <ColegiaturaPaymentForm
              mesesSeleccionados={mesesSeleccionados}
              estudiante={estudiante}
              estudiantes={estudiantes}
              mesesColegiatura={mesesColegiatura}
              calcularTotal={calcularTotal}
              estaVencido={estaVencido}
              onPagoExitoso={handlePagoExitoso}
            />
          </div>
        </div>
      )}

      {/* Diálogo para mostrar el ticket */}
      <TicketDialog
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        ticketData={ticketData}
        estaVencido={estaVencido}
      />
    </div>
  )
}
