"use client"

import { useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/app/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/app/components/ui/tabs"
import {
  Download, FileText, ShoppingBag, Calendar, Printer, CalendarIcon
} from "lucide-react"
import { format } from "date-fns"
// Simple utility function to merge className values
const cn = (...classNames: (string | undefined)[]) => {
  return classNames.filter(Boolean).join(" ")
}
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar"

// Estilos CSS personalizados para ocultar los días de semana no deseados
const calendarStyles = `
  /* Ocultar los nombres de días de semana */
  .rdp-head_cell {
    text-transform: lowercase !important;
    font-size: 0.8rem !important;
  }
  
  /* Solución específica para ocultar "mamijuvisado" */
  .rdp-head_cell:not(:nth-child(1), :nth-child(7)) {
    font-size: 0 !important;
  }
  .rdp-head_cell:nth-child(1):after {
    content: 'lu';
    font-size: 0.8rem;
  }
  .rdp-head_cell:nth-child(2):after {
    content: 'ma';
    font-size: 0.8rem;
  }
  .rdp-head_cell:nth-child(3):after {
    content: 'mi';
    font-size: 0.8rem;
  }
  .rdp-head_cell:nth-child(4):after {
    content: 'ju';
    font-size: 0.8rem;
  }
  .rdp-head_cell:nth-child(5):after {
    content: 'vi';
    font-size: 0.8rem;
  }
  .rdp-head_cell:nth-child(6):after {
    content: 'sa';
    font-size: 0.8rem;
  }
  .rdp-head_cell:nth-child(7):after {
    content: 'do';
    font-size: 0.8rem;
  }
`;

// DatePicker component inline
function DatePicker({ date, setDate, className }: {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full border border-gray-300 bg-white text-left font-normal",
            !date && "text-gray-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? format(date, "dd/MM/yyyy") : "Seleccionar fecha"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <style>{calendarStyles}</style>
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="bg-white"
        />
      </PopoverContent>
    </Popover>
  )
}

// Estilos globales para asegurar que todas las partes de la aplicación tengan fondo blanco
const globalStyles = `
  body, html {
    background-color: white !important;
  }
  
  /* Estilos adicionales para el calendario */
  .rdp {
    background-color: white !important;
  }
  
  .rdp-months {
    background-color: white !important;
  }
  
  .rdp-month {
    background-color: white !important;
  }
  
  .rdp-table {
    background-color: white !important;
  }
  
  .rdp-caption {
    background-color: white !important;
  }
`;

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
      icono: <FileText className="h-6 w-6 text-blue-600" />,
    },
    {
      id: "pagosColegiatura",
      nombre: "Pagos de Colegiatura",
      descripcion: "Historial de pagos de colegiatura realizados",
      icono: <Calendar className="h-6 w-6 text-blue-600" />,
    },
    {
      id: "comprasProductos",
      nombre: "Compras de Productos",
      descripcion: "Detalle de compras de uniformes y libros",
      icono: <ShoppingBag className="h-6 w-6 text-blue-600" />,
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
    <div className="bg-white min-h-screen">
      <style>{globalStyles}</style>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-black mb-6">Reportes</h1>

        <Tabs defaultValue="generar" className="bg-white">
          <TabsList className="mb-6 bg-gray-100 p-1 rounded">
            <TabsTrigger 
              value="generar" 
              className="data-[state=active]:bg-white rounded px-4 py-2"
            >
              Generar Reportes
            </TabsTrigger>
            <TabsTrigger 
              value="historial" 
              className="data-[state=active]:bg-white rounded px-4 py-2"
            >
              Historial de Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generar">
            <div className="mb-8 bg-white shadow-sm">
              <div className="border-b bg-white p-6">
                <h3 className="text-black text-lg font-bold">
                  Filtros de Reporte
                </h3>
                <p className="text-gray-600 text-sm">
                  Selecciona los filtros para generar el reporte deseado
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="estudiante" className="text-sm font-medium text-black">
                      Estudiante
                    </label>
                    <Select value={estudiante} onValueChange={(value) => setEstudiante(value)}>
                      <SelectTrigger className="w-full border border-gray-300 rounded bg-white">
                        <SelectValue placeholder="Seleccionar estudiante" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-0 shadow-lg">
                        <SelectItem value="todos" className="hover:bg-gray-100">Todos los estudiantes</SelectItem>
                        {estudiantes.map((est) => (
                          <SelectItem key={est.id} value={est.id} className="hover:bg-gray-100">
                            {est.nombre} - {est.grado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fechaInicio" className="text-sm font-medium text-black">
                      Fecha Inicio
                    </label>
                    <DatePicker date={fechaInicio} setDate={setFechaInicio} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fechaFin" className="text-sm font-medium text-black">
                      Fecha Fin
                    </label>
                    <DatePicker date={fechaFin} setDate={setFechaFin} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportes.map((reporte) => (
                <div 
                  key={reporte.id} 
                  className="border border-gray-200 rounded-lg shadow-sm bg-white"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6 p-4 bg-gray-100 rounded-full">
                        {reporte.icono}
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">{reporte.nombre}</h3>
                      <p className="text-gray-600 text-sm mb-6">{reporte.descripcion}</p>
                      <div className="flex gap-2 w-full mt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-gray-300 text-black"
                          onClick={() => handleGenerarPDF(reporte.id, 'imprimir')}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir
                        </Button>
                        <Button 
                          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                          onClick={() => handleGenerarPDF(reporte.id, 'descargar')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="historial">
            <div className="bg-white shadow-sm mx-auto max-w-4xl">
              <div className="border-b bg-white p-6">
                <h3 className="text-black text-lg font-bold">
                  Historial de Reportes Generados
                </h3>
                <p className="text-gray-600 text-sm">
                  Reportes generados anteriormente
                </p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-4 font-medium text-black">Fecha</th>
                        <th className="p-4 font-medium text-black">Tipo de Reporte</th>
                        <th className="p-4 font-medium text-black">Estudiante</th>
                        <th className="p-4 font-medium text-black">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historialReportes.map((reporte, index) => (
                        <tr 
                          key={reporte.id} 
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 text-black">{reporte.fecha}</td>
                          <td className="p-4 text-black">{reporte.tipoNombre}</td>
                          <td className="p-4 text-black">{reporte.estudianteNombre}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="border-gray-300 text-black"
                                onClick={() => handleHistorialReporte(reporte, 'imprimir')}
                              >
                                <Printer className="mr-1 h-3 w-3" />
                                Imprimir
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-pink-500 hover:bg-pink-600 text-white"
                                onClick={() => handleHistorialReporte(reporte, 'descargar')}
                              >
                                <Download className="mr-1 h-3 w-3" />
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}