import { AlertCircle, DollarSign, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MesColegiatura, Convenio } from "../types"

interface ColegiaturaResumenProps {
  convenios: Convenio[]
  mesesColegiatura: MesColegiatura[]
  estaVencido: (vencimiento: string) => boolean
}

export default function ColegiaturaResumen({ convenios, mesesColegiatura, estaVencido }: ColegiaturaResumenProps) {
  // Obtener los próximos pagos pendientes
  const proximosPagos = mesesColegiatura
    .filter((mes) => mes.estado === "pendiente")
    .sort((a, b) => {
      if (!a.vencimiento || !b.vencimiento) return 0
      const fechaA = new Date(a.vencimiento.split("/").reverse().join("-"))
      const fechaB = new Date(b.vencimiento.split("/").reverse().join("-"))
      return fechaA.getTime() - fechaB.getTime()
    })
    .slice(0, 2) // Mostrar solo los 2 primeros

  return (
    <Card className="border-gray-200 shadow-md sticky top-6">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-pink-500" />
          Resumen de Pagos
        </CardTitle>
        <CardDescription className="text-gray-600">Estado de colegiaturas del ciclo escolar</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Recordatorio</h4>
              <p className="text-amber-700 text-sm mt-1">
                Después del día 12 de cada mes se aplica un 10% de interés a los pagos pendientes.
              </p>
            </div>
          </div>
        </div>

        {/* Convenios activos */}
        {convenios.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-3">Convenios por atraso</h4>
            <div className="space-y-3">
              {convenios.map((convenio) => (
                <div key={convenio.id_convenio} className="p-3 border border-pink-200 rounded-lg bg-pink-50">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">{convenio.estudiante}</p>
                      <p className="text-sm text-gray-600">{convenio.tipo}</p>
                      <p className="text-sm text-gray-600 mt-1">{convenio.descripcion}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Vigencia: {new Date(convenio.fecha_inicio).toLocaleDateString()} - {convenio.fechaFin}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Próximos pagos</h4>
          <div className="space-y-3">
            {proximosPagos.map((pago) => (
              <div key={pago.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      {pago.nombre} {new Date().getFullYear()}
                    </p>
                    <p className="text-sm text-gray-600">Vence: {pago.vencimiento}</p>
                    <p className="text-xs text-gray-500">{pago.nombreEstudiante}</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                    Pendiente
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Información sobre convenios</h4>
          <p className="text-sm text-blue-700">
            Los convenios por atraso se generan automáticamente cuando un estudiante tiene 2 o más pagos atrasados.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
