"use client"

import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import type { EstudianteUI } from "@/app/dashboard/colegiatura/types"

interface ColegiaturaFiltersProps {
  busqueda: string
  setBusqueda: (value: string) => void
  filtroEstado: string
  setFiltroEstado: (value: string) => void
  filtroEstudiante: string
  setFiltroEstudiante: (value: string) => void
  filtroPeriodo: string
  setFiltroPeriodo: (value: string) => void
  estudiantes: EstudianteUI[]
}

export default function ColegiaturaFilters({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroEstudiante,
  setFiltroEstudiante,
  filtroPeriodo,
  setFiltroPeriodo,
  estudiantes,
}: ColegiaturaFiltersProps) {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por mes o estudiante..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 bg-white border-gray-200 text-gray-800"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-[140px] h-9 bg-white text-gray-800">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="pagado">Pagados</SelectItem>
              <SelectItem value="vencido">Vencidos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroEstudiante} onValueChange={setFiltroEstudiante}>
            <SelectTrigger className="w-[140px] h-9 bg-white text-gray-800">
              <SelectValue placeholder="Estudiante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {estudiantes.map((est) => (
                <SelectItem key={est.id} value={est.id}>
                  {est.nombre.split(" ")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
