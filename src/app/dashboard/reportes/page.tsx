"use client"

import { useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/app/components/ui/select"
import { DatePicker } from "@/app/components/ui/date-picker"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/app/components/ui/tabs"
import {
  Download, FileText, ShoppingBag, Calendar, Printer
} from "lucide-react"

export default function ReportesPage() {
  const [estudiante, setEstudiante] = useState<string>("")
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()
  const [tipo, setTipo] = useState('estadoCuenta')
  const [estudianteId, setEstudianteId] = useState('todos')

  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B" },
  ]

  const reportes = [
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
  ]

  // Lista de reportes históricos
  const historialReportes = [
    {
      id: "hist1",
      fecha: "2025-04-01",
      tipo: "estadoCuenta",
      tipoNombre: "Estado de Cuenta",
      estudianteId: "est1",
      estudianteNombre: "Ana Pérez González",
      fechaInicio: "2025-03-01",
      fechaFin: "2025-04-01"
    },
    {
      id: "hist2",
      fecha: "2025-03-25",
      tipo: "pagosColegiatura",
      tipoNombre: "Pagos de Colegiatura",
      estudianteId: "est2",
      estudianteNombre: "Carlos Pérez González",
      fechaInicio: "2025-02-01",
      fechaFin: "2025-03-25"
    },
    {
      id: "hist3",
      fecha: "2025-03-15",
      tipo: "comprasProductos",
      tipoNombre: "Compras de Productos",
      estudianteId: "todos",
      estudianteNombre: "Todos los estudiantes",
      fechaInicio: "2025-01-01",
      fechaFin: "2025-03-15"
    }
  ]

  const handleGenerarPDF = (tipoReporte: string, accion: 'descargar' | 'imprimir') => {
    if (!fechaInicio || !fechaFin) {
      alert("Selecciona el rango de fechas.")
      return
    }

    setTipo(tipoReporte)

    const url = `/api/generar-pdf?tipo=${tipoReporte}&estudianteId=${estudiante || 'todos'}&fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`

    if (accion === 'imprimir') {
      // Abrir en nueva pestaña e imprimir
      const ventanaImpresion = window.open(url, "_blank")
      if (ventanaImpresion) {
        ventanaImpresion.onload = function() {
          setTimeout(() => {
            ventanaImpresion.print()
          }, 1000)
        }
      }
    } else {
      // Descargar automáticamente
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const link = document.createElement("a")
          const href = window.URL.createObjectURL(blob)
          
          // Obtener el nombre descriptivo del reporte
          let nombreReporte = "reporte"
          if (tipoReporte === "estadoCuenta") nombreReporte = "EstadoDeCuenta"
          else if (tipoReporte === "pagosColegiatura") nombreReporte = "PagosColegiatura"
          else if (tipoReporte === "comprasProductos") nombreReporte = "ComprasProductos"
          
          // Obtener el nombre del estudiante seleccionado
          let nombreEstudiante = "Todos"
          if (estudiante) {
            const estSeleccionado = estudiantes.find(est => est.id === estudiante)
            if (estSeleccionado) {
              nombreEstudiante = estSeleccionado.nombre.replace(/\s+/g, '-')
            }
          }
          
          // Crear nombre de archivo descriptivo
          link.href = href
          link.download = `${estudiante || 'todos'}-${nombreEstudiante}-${nombreReporte}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(href)
        })
        .catch(error => {
          console.error("Error al descargar el PDF:", error)
          alert("Ocurrió un error al generar el reporte")
        })
    }
  }

  // Nueva función para manejar los reportes del historial usando el mismo endpoint que los reportes nuevos
  const handleHistorialReporte = (reporte: any, accion: 'descargar' | 'imprimir') => {
    // Usar el mismo endpoint que para los reportes nuevos, pero con los datos del reporte histórico
    const url = `/api/generar-pdf?tipo=${reporte.tipo}&estudianteId=${reporte.estudianteId}&fechaInicio=${reporte.fechaInicio}&fechaFin=${reporte.fechaFin}`
    
    if (accion === 'imprimir') {
      // Abrir en nueva pestaña e imprimir - igual que en handleGenerarPDF
      const ventanaImpresion = window.open(url, "_blank")
      if (ventanaImpresion) {
        ventanaImpresion.onload = function() {
          setTimeout(() => {
            ventanaImpresion.print()
          }, 1000)
        }
      }
    } else {
      // Descargar automáticamente - igual que en handleGenerarPDF
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const link = document.createElement("a")
          const href = window.URL.createObjectURL(blob)
          
          // Obtener el nombre descriptivo del reporte
          let nombreReporte = "reporte"
          if (reporte.tipo === "estadoCuenta") nombreReporte = "EstadoDeCuenta"
          else if (reporte.tipo === "pagosColegiatura") nombreReporte = "PagosColegiatura"
          else if (reporte.tipo === "comprasProductos") nombreReporte = "ComprasProductos"
          
          // Crear nombre de archivo descriptivo
          link.href = href
          link.download = `${reporte.estudianteId}-${reporte.estudianteNombre.replace(/\s+/g, '-')}-${nombreReporte}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(href)
        })
        .catch(error => {
          console.error("Error al descargar el PDF del historial:", error)
          alert("Ocurrió un error al obtener el reporte del historial")
        })
    }
  }

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
                  <Select value={estudiante} onValueChange={(value) => setEstudiante(value)}>
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
                    <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full">
                      {reporte.icono}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{reporte.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-6">{reporte.descripcion}</p>
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleGenerarPDF(reporte.id, 'imprimir')}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={() => handleGenerarPDF(reporte.id, 'descargar')}
                      >
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
                                size="sm"
                                onClick={() => handleHistorialReporte(reporte, 'descargar')}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Descargar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleHistorialReporte(reporte, 'imprimir')}
                              >
                                <Printer className="w-4 h-4 mr-1" />
                                Imprimir
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
        </TabsContent>
      </Tabs>
    </div>
  )
}