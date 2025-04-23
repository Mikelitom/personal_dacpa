"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DatePicker } from "@/app/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Download, FileText, ShoppingBag, Calendar, Printer } from "lucide-react"

export default function ReportesPage() {
  const [estudiante, setEstudiante] = useState<string>("")
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()

  // Datos de ejemplo
  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B" },
  ]

  const reportes = [
    {
      id: "rep1",
      nombre: "Estado de Cuenta",
      descripcion: "Reporte detallado de todos los movimientos financieros",
      icono: <FileText className="h-8 w-8" />,
    },
    {
      id: "rep2",
      nombre: "Pagos de Colegiatura",
      descripcion: "Historial de pagos de colegiatura realizados",
      icono: <Calendar className="h-8 w-8" />,
    },
    {
      id: "rep3",
      nombre: "Compras de Productos",
      descripcion: "Detalle de compras de uniformes y libros",
      icono: <ShoppingBag className="h-8 w-8" />,
    },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      <Tabs defaultValue="generar">
        <TabsList className="mb-6">
          <TabsTrigger value="generar">Generar Reportes</TabsTrigger>
          <TabsTrigger value="historial">Historial de Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="generar">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros de Reporte</CardTitle>
              <CardDescription>Selecciona los filtros para generar el reporte deseado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estudiante</label>
                  <Select value={estudiante} onValueChange={setEstudiante}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estudiantes</SelectItem>
                      {estudiantes.map((est) => (
                        <SelectItem key={est.id} value={est.id}>
                          {est.nombre} - {est.grado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha Inicio</label>
                  <DatePicker date={fechaInicio} setDate={setFechaInicio} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha Fin</label>
                  <DatePicker date={fechaFin} setDate={setFechaFin} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {reportes.map((reporte) => (
              <Card key={reporte.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full">{reporte.icono}</div>
                    <h3 className="text-lg font-semibold mb-2">{reporte.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-6">{reporte.descripcion}</p>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" className="flex-1">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historial">
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
                        <th className="p-3 border-b">Periodo</th>
                        <th className="p-3 border-b">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">05/04/2024</td>
                        <td className="p-3">Estado de Cuenta</td>
                        <td className="p-3">Ana Pérez González</td>
                        <td className="p-3">Enero - Abril 2024</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">01/04/2024</td>
                        <td className="p-3">Pagos de Colegiatura</td>
                        <td className="p-3">Carlos Pérez González</td>
                        <td className="p-3">Enero - Marzo 2024</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">15/02/2024</td>
                        <td className="p-3">Compras de Productos</td>
                        <td className="p-3">Todos los estudiantes</td>
                        <td className="p-3">Enero - Febrero 2024</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
