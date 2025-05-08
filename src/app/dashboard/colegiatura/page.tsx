"use client"

import { useColegiatura } from "./hooks/use-colegiatura-data"
import { PaymentSummary } from "./components/payment-summary"
import { PaymentList } from "./components/payment-list"
import { PaymentForm } from "./components/payment-form"
import { PaymentReceipt } from "./components/payment-receipt"
import { PaymentSuccess } from "./components/payment-success"
import { useUsuario } from "../hooks/use-usuario"

export default function ColegiaturaPage() {
  const { usuario, loading: userLoading } = useUsuario()

  const {
    alumnos,
    convenios,
    pagos,
    loading: loadingColegiatura,
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
  } = useColegiatura()

  const loading = userLoading || loadingColegiatura;

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de pagos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pago de Colegiatura</h1>

      {pagado ? (
        <PaymentSuccess total={calcularTotal()} onNewPayment={handleNewPayment} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen de pagos */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PaymentSummary alumnos={alumnos} convenios={convenios} pagos={pagos} />
          </div>

          {/* Lista de meses */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <PaymentList
              alumnos={alumnos}
              pagos={pagos}
              mesesSeleccionados={mesesSeleccionados}
              toggleMesSeleccionado={toggleMesSeleccionado}
              calcularTotal={calcularTotal}
            />

            {/* Formulario de pago */}
            <PaymentForm
              alumnos={alumnos}
              email={usuario?.correo}
              pagos={pagos}
              mesesSeleccionados={mesesSeleccionados}
              calcularTotal={calcularTotal}
              onPagoExitoso={handlePagoExitoso}
              estudianteSeleccionado={estudianteSeleccionado}
            />
          </div>
        </div>
      )}

      {/* Diálogo para mostrar el ticket */}
      <PaymentReceipt open={ticketDialogOpen} onOpenChange={setTicketDialogOpen} ticketData={ticketData} />
    </div>
  )
}
