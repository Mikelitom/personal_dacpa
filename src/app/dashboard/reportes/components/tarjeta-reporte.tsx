import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent
} from "@/app/components/ui/card"
import { Printer, Download } from "lucide-react"
import { ReporteInfo } from "../../types"

interface TarjetaReporteProps {
  reporte: ReporteInfo;
  onGenerarPDF: (tipoReporte: string, accion: 'descargar' | 'imprimir') => void;
}

export function TarjetaReporte({ reporte, onGenerarPDF }: TarjetaReporteProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full">
            {reporte.icono}
          </div>
          <h3 className="text-lg font-semibold mb-2">{reporte.nombre}</h3>
          <p className="text-gray-500 text-sm mb-6">{reporte.descripcion}</p>
          <div className="flex gap-2 mt-auto">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onGenerarPDF(reporte.id, 'imprimir')}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => onGenerarPDF(reporte.id, 'descargar')}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}