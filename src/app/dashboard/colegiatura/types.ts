// Importar los tipos de la base de datos
import type { Database } from "@/app/lib/types"

// Usar los tipos directamente de la base de datos
export type Estudiante = Database["public"]["Tables"]["Alumno"]["Row"]
export type PadreFamilia = Database["public"]["Tables"]["PadreFamilia"]["Row"]
export type HistorialPago = Database["public"]["Tables"]["HistorialPago"]["Row"]
export type Convenio = Database["public"]["Tables"]["Convenio"]["Row"] & {
  estudiante?: string // Campo adicional para UI
  tipo?: string // Campo adicional para UI
  descripcion?: string // Campo adicional para UI
  fechaFin?: string // Campo adicional para UI
}
export type PagoColegiatura = Database["public"]["Tables"]["PagoColegiatura"]["Row"]

// Tipos específicos para la UI
export type MesColegiatura = {
  id: string
  nombre: string
  monto: number
  estado: string
  fechaPago?: string
  vencimiento?: string
  incluye?: string
  estudiante: string
  nombreEstudiante: string
  interes?: number
}

export type TicketData = {
  fecha: string
  estudiante: string
  grado: string
  meses: MesColegiatura[]
  total: number
  ticket: string
  colegio: string
  direccion: string
  telefono: string
}

export type EstudianteUI = {
  id: string
  nombre: string
  grado: string
  monto: string
  tieneConvenio: boolean
  descuento?: string
}
