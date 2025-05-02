import { Database } from "../lib/types";

export type Usuario = Database['public']['Tables']['Usuario']['Row'];
export type Alumno = Database['public']['Tables']['Alumno']['Row'];
export type Convenio = Database['public']['Tables']['Convenio']['Row'];
export type PagoColegiatura = Database['public']['Tables']['PagoColegiatura']['Row']
export type PadreFamilia = Database['public']['Tables']['PadreFamilia']['Row']
export type Articulo = Database['public']['Tables']['Articulo']['Row']
export type ArticuloConCantidad = Database['public']['Tables']['Articulo']['Row'] & {
  cantidad?: number
}

export interface ReporteInfo {
  id: string;
  nombre: string;
  descripcion: string;
  icono: React.ReactNode;
}

export interface HistorialReporte {
  id: string;
  fecha: string;
  tipo: string;
  tipoNombre: string;
  estudianteId: string | number;
  estudianteNombre: string;
  fechaInicio: string;
  fechaFin: string;
}