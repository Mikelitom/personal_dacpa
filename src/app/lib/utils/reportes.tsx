import { FileText, ShoppingBag, Calendar } from "lucide-react"
import { ReporteInfo } from "@/app/dashboard/types"

export const TIPOS_REPORTES: ReporteInfo[] = [
  {
    id: "estadoCuenta",
    nombre: "Estado de Cuenta",
    descripcion: "Reporte detallado de todos los movimientos financieros",
    icono: <FileText className="h-8 w-8" />,
  },
  {
    id: "pagosColegiatura",
    nombre: "Pagos de Colegiatura",
    descripcion: "Historial de pagos de colegiatura realizados",
    icono: <Calendar className="h-8 w-8" />,
  },
  {
    id: "comprasProductos",
    nombre: "Compras de Productos",
    descripcion: "Detalle de compras de uniformes y libros",
    icono: <ShoppingBag className="h-8 w-8" />,
  },
];

export function getNombreReporte(tipoReporte: string): string {
  switch (tipoReporte) {
    case "estadoCuenta": return "EstadoDeCuenta";
    case "pagosColegiatura": return "PagosColegiatura";
    case "comprasProductos": return "ComprasProductos";
    default: return "Reporte";
  }
}