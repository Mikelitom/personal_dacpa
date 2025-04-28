import { AlertCircle } from "lucide-react"
import { CardContent, CardFooter } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import type { MesColegiatura, EstudianteUI } from "@/app/dashboard/colegiatura/types"
import MesColegiaturaItem from "./mes-colegiatura-item"

interface ColegiaturaListProps {
  mesesFiltrados: MesColegiatura[]
  estudiantes: EstudianteUI[]
  filtroEstudiante: string
  mesesSeleccionados: string[]
  toggleMesSeleccionado: (mesId: string) => void
  estaVencido: (vencimiento: string) => boolean
  calcularTotal: () => number
}

export default function ColegiaturaList({
  mesesFiltrados,
  estudiantes,
  filtroEstudiante,
  mesesSeleccionados,
  toggleMesSeleccionado,
  estaVencido,
  calcularTotal,
}: ColegiaturaListProps) {
  // Función para obtener el badge de estado
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pagado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Pagado
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            Pendiente
          </Badge>
        )
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <CardContent className="p-0">
        {filtroEstudiante === "todos" ? (
          // Si no hay filtro de estudiante, mostrar agrupados por estudiante
          estudiantes.map((est) => {
            const mesesEstudiante = mesesFiltrados.filter((mes) => mes.estudiante === est.id)
            if (mesesEstudiante.length === 0) return null

            return (
              <div key={est.id} className="mb-4">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">
                    {est.nombre} - {est.grado}
                    {est.tieneConvenio && (
                      <Badge className="ml-2 bg-pink-100 text-pink-700 border-pink-200">Con convenio</Badge>
                    )}
                  </h3>
                </div>
                <div className="divide-y">
                  {mesesEstudiante.map((mes) => (
                    <MesColegiaturaItem
                      key={mes.id}
                      mes={mes}
                      isVencido={estaVencido(mes.vencimiento || "")}
                      isSelected={mesesSeleccionados.includes(mes.id)}
                      onToggleSelect={toggleMesSeleccionado}
                      getEstadoBadge={getEstadoBadge}
                    />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          // Si hay filtro de estudiante, mostrar solo las mensualidades de ese estudiante
          <div className="divide-y">
            {mesesFiltrados.map((mes) => (
              <MesColegiaturaItem
                key={mes.id}
                mes={mes}
                isVencido={estaVencido(mes.vencimiento || "")}
                isSelected={mesesSeleccionados.includes(mes.id)}
                onToggleSelect={toggleMesSeleccionado}
                getEstadoBadge={getEstadoBadge}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm text-gray-700">Después del día 12 se aplica un 10% de interés</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total seleccionado</div>
            <div className="text-2xl font-bold text-gray-800">${calcularTotal().toFixed(2)}</div>
          </div>
        </div>
      </CardFooter>
    </>
  )
}
