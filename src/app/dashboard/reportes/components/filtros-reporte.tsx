import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/app/components/ui/select"
import { DatePicker } from "@/app/components/ui/date-picker"
import { Alumno } from "../../types"

interface FiltrosReporteProps {
  estudiantes: { id: string | number; nombre: string; grado: string }[];
  estudianteId: string | number;
  setEstudianteId: (id: string | number) => void;
  fechaInicio: Date | undefined;
  setFechaInicio: (date: Date | undefined) => void;
  fechaFin: Date | undefined;
  setFechaFin: (date: Date | undefined) => void;
}

export function FiltrosReporte({
  estudiantes,
  estudianteId,
  setEstudianteId,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin
}: FiltrosReporteProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filtros de Reporte</CardTitle>
        <CardDescription>Selecciona los filtros para generar el reporte deseado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="estudiante" className="text-sm font-medium">Estudiante</label>
            <Select 
              value={estudianteId.toString()} 
              onValueChange={(value) => setEstudianteId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estudiante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estudiantes</SelectItem>
                {estudiantes.map((est) => (
                  <SelectItem key={est.id.toString()} value={est.id.toString()}>
                    {est.nombre} - {est.grado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="fechaInicio" className="text-sm font-medium">Fecha Inicio</label>
            <DatePicker date={fechaInicio} setDate={setFechaInicio} />
          </div>

          <div className="space-y-2">
            <label htmlFor="fechaFin" className="text-sm font-medium">Fecha Fin</label>
            <DatePicker date={fechaFin} setDate={setFechaFin} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}