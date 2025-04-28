import type React from "react"
import { AlertCircle } from "lucide-react"
import { Badge } from "@/app/components/ui/badge"
import { Checkbox } from "@/app/components/ui/checkbox"
import type { MesColegiatura } from "@/app/dashboard/colegiatura/types"

interface MesColegiaturaItemProps {
  mes: MesColegiatura
  isVencido: boolean
  isSelected: boolean
  onToggleSelect: (mesId: string) => void
  getEstadoBadge: (estado: string) => React.ReactNode
}

export default function MesColegiaturaItem({
  mes,
  isVencido,
  isSelected,
  onToggleSelect,
  getEstadoBadge,
}: MesColegiaturaItemProps) {
  const estado = isVencido ? "vencido" : mes.estado

  return (
    <div
      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors ${
        mes.estado === "pagado" ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start mb-3 sm:mb-0">
        {mes.estado === "pendiente" && (
          <Checkbox
            id={`mes-${mes.id}`}
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(mes.id)}
            className="mr-3 mt-1"
            disabled={mes.estado === "pagado"}
          />
        )}
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800">{mes.nombre}</h3>
            {mes.incluye && <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">+ {mes.incluye}</Badge>}
            <div className="ml-3">{getEstadoBadge(estado)}</div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {mes.estado === "pagado" ? <span>Pagado el {mes.fechaPago}</span> : <span>Vence el {mes.vencimiento}</span>}
          </div>
          <div className="text-xs text-gray-500">Estudiante: {mes.nombreEstudiante}</div>
        </div>
      </div>
      <div className="flex flex-col sm:items-end">
        <div className="font-bold text-lg text-gray-800">${mes.monto.toFixed(2)}</div>
        {mes.interes && <div className="text-sm text-red-500">+ ${mes.interes.toFixed(2)} (10% interés)</div>}
        {isVencido && !mes.interes && (
          <div className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Incluye 10% de interés
          </div>
        )}
      </div>
    </div>
  )
}
