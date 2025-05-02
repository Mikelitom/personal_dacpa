import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card"
import { Printer, Download } from "lucide-react"
import { HistorialReporte } from "../../types"

interface TablaHistorialProps {
  historialReportes: HistorialReporte[];
  onHistorialReporte: (reporte: HistorialReporte, accion: 'descargar' | 'imprimir') => void;
}

export function TablaHistorial({ historialReportes, onHistorialReporte }: TablaHistorialProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Reportes Generados</CardTitle>
        <CardDescription>Reportes generados anteriormente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle p-4 sm:p-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Fecha</th>
                  <th className="p-3 border-b">Tipo de Reporte</th>
                  <th className="p-3 border-b">Estudiante</th>
                  <th className="p-3 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {historialReportes.map((reporte) => (
                  <tr key={reporte.id}>
                    <td className="p-3">{reporte.fecha}</td>
                    <td className="p-3">{reporte.tipoNombre}</td>
                    <td className="p-3">{reporte.estudianteNombre}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => onHistorialReporte(reporte, 'imprimir')}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir
                        </Button>
                        <Button 
                          onClick={() => onHistorialReporte(reporte, 'descargar')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}