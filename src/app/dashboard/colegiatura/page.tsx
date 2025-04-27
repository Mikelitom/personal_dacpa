"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Badge } from "@/app/components/ui/badge"
import { Calendar, AlertCircle, DollarSign, CheckCircle2, Clock, Search, Printer } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"

export default function ColegiaturaPage() {
  const [estudiante, setEstudiante] = useState("")
  const [mesesSeleccionados, setMesesSeleccionados] = useState<string[]>([])
  const [pagado, setPagado] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroEstudiante, setFiltroEstudiante] = useState("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)

  // Datos de ejemplo
  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A", monto: "1500.00", tieneConvenio: true, descuento: "10%" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B", monto: "1500.00", tieneConvenio: false },
  ]

  const mesesColegiatura = [
    {
      id: "ene",
      nombre: "Enero",
      monto: 1500,
      estado: "pagado",
      fechaPago: "10/01/2024",
      incluye: "Libros",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "feb",
      nombre: "Febrero",
      monto: 1500,
      estado: "pagado",
      fechaPago: "08/02/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "mar",
      nombre: "Marzo",
      monto: 1500,
      estado: "pagado",
      fechaPago: "12/03/2024",
      interes: 150,
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "abr",
      nombre: "Abril",
      monto: 1500,
      estado: "pagado",
      fechaPago: "09/04/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "may",
      nombre: "Mayo",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/05/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "ago",
      nombre: "Agosto",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/08/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "sep",
      nombre: "Septiembre",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/09/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "oct",
      nombre: "Octubre",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/10/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "nov",
      nombre: "Noviembre",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/11/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },
    {
      id: "dic",
      nombre: "Diciembre",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/12/2024",
      estudiante: "est1",
      nombreEstudiante: "Ana Pérez González",
    },

    {
      id: "ene2",
      nombre: "Enero",
      monto: 1500,
      estado: "pagado",
      fechaPago: "10/01/2024",
      incluye: "Libros",
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
    {
      id: "feb2",
      nombre: "Febrero",
      monto: 1500,
      estado: "pagado",
      fechaPago: "08/02/2024",
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
    {
      id: "mar2",
      nombre: "Marzo",
      monto: 1500,
      estado: "pagado",
      fechaPago: "12/03/2024",
      interes: 150,
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
    {
      id: "abr2",
      nombre: "Abril",
      monto: 1500,
      estado: "pagado",
      fechaPago: "09/04/2024",
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
    {
      id: "may2",
      nombre: "Mayo",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/05/2024",
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
    {
      id: "ago2",
      nombre: "Agosto",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/08/2024",
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
    {
      id: "sep2",
      nombre: "Septiembre",
      monto: 1500,
      estado: "pendiente",
      vencimiento: "10/09/2024",
      estudiante: "est2",
      nombreEstudiante: "Carlos Pérez González",
    },
  ]

  const convenios = [
    {
      id: "conv1",
      estudiante: "Ana Pérez González",
      tipo: "Convenio por atraso",
      descripcion: "Descuento del 10% en colegiaturas pendientes por pago anticipado",
      fechaInicio: "01/05/2024",
      fechaFin: "31/05/2024",
    },
  ]

  // Calcular estadísticas al cargar o cuando cambian los filtros
  useEffect(() => {
    // Si se selecciona un estudiante específico, establecer el estado estudiante para el pago
    if (filtroEstudiante !== "todos" && filtroEstudiante !== "") {
      setEstudiante(filtroEstudiante)
    }
  }, [filtroEstudiante])

  const handlePagoExitoso = () => {
    // Crear datos del ticket
    const estudianteInfo = estudiantes.find((est) => est.id === estudiante)
    const mesesInfo = mesesSeleccionados
      .map((mesId) => {
        const mes = mesesColegiatura.find((m) => m.id === mesId)
        return mes
      })
      .filter(Boolean)

    const ticketInfo = {
      fecha: new Date().toLocaleDateString(),
      estudiante: estudianteInfo?.nombre || "",
      grado: estudianteInfo?.grado || "",
      meses: mesesInfo,
      total: calcularTotal(),
      ticket: TICK-${Date.now().toString().slice(-6)},
      colegio: "Colegio Ejemplo",
      direccion: "Av. Principal #123, Ciudad",
      telefono: "555-123-4567",
    }

    setTicketData(ticketInfo)
    setTicketDialogOpen(true)

    // Resetear después de mostrar confirmación
    setTimeout(() => {
      setPagado(true)
    }, 500)
  }

  const toggleMesSeleccionado = (mesId: string) => {
    const mes = mesesColegiatura.find((m) => m.id === mesId)

    // Si ya hay meses seleccionados, verificar que sean del mismo estudiante
    if (mesesSeleccionados.length > 0) {
      const primerMesId = mesesSeleccionados[0]
      const primerMes = mesesColegiatura.find((m) => m.id === primerMesId)

      if (primerMes && mes && primerMes.estudiante !== mes.estudiante) {
        alert("No se pueden mezclar colegiaturas de diferentes estudiantes en un mismo pago.")
        return
      }

      // Establecer el estudiante automáticamente
      if (mes && !estudiante) {
        setEstudiante(mes.estudiante)
      }
    } else if (mes) {
      // Si es el primer mes seleccionado, establecer el estudiante
      setEstudiante(mes.estudiante)
    }

    if (mesesSeleccionados.includes(mesId)) {
      setMesesSeleccionados(mesesSeleccionados.filter((id) => id !== mesId))
    } else {
      setMesesSeleccionados([...mesesSeleccionados, mesId])
    }
  }

  // Modificar la función calcularTotal para incluir el interés automáticamente para meses vencidos
  const calcularTotal = () => {
    let total = 0
    mesesSeleccionados.forEach((mesId) => {
      const mes = mesesColegiatura.find((m) => m.id === mesId)
      if (mes) {
        total += mes.monto
        // Si ya tiene interés definido, usarlo
        if (mes.interes) {
          total += mes.interes
        }
        // Si está vencido pero no tiene interés definido, calcularlo
        else if (mes.estado === "pendiente" && estaVencido(mes.vencimiento || "")) {
          const interes = mes.monto * 0.1 // 10% de interés
          total += interes
        }
      }
    })
    return total
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pagado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Pagado
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            Pendiente
          </Badge>
        )
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>
      default:
        return null
    }
  }

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (vencimiento: string) => {
    if (!vencimiento) return false
    const fechaVencimiento = new Date(vencimiento.split("/").reverse().join("-"))
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  // Filtrar meses según los criterios seleccionados
  const filtrarMeses = () => {
    return mesesColegiatura.filter((mes) => {
      // Filtro por búsqueda
      if (busqueda) {
        const searchLower = busqueda.toLowerCase()
        const matchesNombre = mes.nombre.toLowerCase().includes(searchLower)
        const matchesEstudiante = mes.nombreEstudiante.toLowerCase().includes(searchLower)
        if (!matchesNombre && !matchesEstudiante) return false
      }

      // Filtro por estado
      if (filtroEstado !== "todos") {
        if (filtroEstado === "vencido") {
          if (!(mes.estado === "pendiente" && estaVencido(mes.vencimiento || ""))) return false
        } else if (mes.estado !== filtroEstado) {
          return false
        }
      }

      // Filtro por estudiante
      if (filtroEstudiante !== "todos" && mes.estudiante !== filtroEstudiante) return false

      // Filtro por periodo
      if (filtroPeriodo === "verano" && (mes.nombre === "Junio" || mes.nombre === "Julio")) return true
      if (filtroPeriodo === "regular" && mes.nombre !== "Junio" && mes.nombre !== "Julio") return true
      if (filtroPeriodo !== "todos" && filtroPeriodo !== "verano" && filtroPeriodo !== "regular") return false

      return true
    })
  }

  const mesesFiltrados = filtrarMeses()

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pago de Colegiatura</h1>

      {pagado ? (
        <Card className="max-w-md mx-auto border-gray-200 shadow-md">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800">¡Pago Realizado con Éxito!</h2>
            <p className="text-center mt-2 text-gray-700">
              El pago de colegiatura por ${calcularTotal().toFixed(2)} ha sido procesado correctamente.
            </p>
            <Button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white" onClick={() => setPagado(false)}>
              Realizar otro pago
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen de pagos */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="border-gray-200 shadow-md sticky top-6">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-pink-500" />
                  Resumen de Pagos
                </CardTitle>
                <CardDescription className="text-gray-600">Estado de colegiaturas del ciclo escolar</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Recordatorio</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        Después del día 12 de cada mes se aplica un 10% de interés a los pagos pendientes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Convenios activos */}
                {convenios.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-3">Convenios por atraso</h4>
                    <div className="space-y-3">
                      {convenios.map((convenio) => (
                        <div key={convenio.id} className="p-3 border border-pink-200 rounded-lg bg-pink-50">
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-800">{convenio.estudiante}</p>
                              <p className="text-sm text-gray-600">{convenio.tipo}</p>
                              <p className="text-sm text-gray-600 mt-1">{convenio.descripcion}</p>
                              <div className="mt-2 text-xs text-gray-500">
                                Vigencia: {convenio.fechaInicio} - {convenio.fechaFin}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">Próximos pagos</h4>
                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Mayo 2024</p>
                          <p className="text-sm text-gray-600">Vence: 10/05/2024</p>
                          <p className="text-xs text-gray-500">Ana Pérez González</p>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Pendiente
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Mayo 2024</p>
                          <p className="text-sm text-gray-600">Vence: 10/05/2024</p>
                          <p className="text-xs text-gray-500">Carlos Pérez González</p>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Pendiente
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Información sobre convenios</h4>
                  <p className="text-sm text-blue-700">
                    Los convenios por atraso se generan automáticamente cuando un estudiante tiene 2 o más pagos
                    atrasados. 
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de meses */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="pb-2 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg text-gray-800 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                      Colegiaturas {new Date().getFullYear()}
                    </CardTitle>
                    <CardDescription className="text-gray-600">Selecciona los meses que deseas pagar</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Filtros */}
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
                  <div className="flex gap-2">
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
                    <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                      <SelectTrigger className="w-[140px] h-9 bg-white text-gray-800">
                        <SelectValue placeholder="Periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="verano">Verano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <CardContent className="p-0">
                {/* Agrupar mensualidades por estudiante */}
                {filtroEstudiante === "todos" ? (
                  // Si no hay filtro de estudiante, mostrar agrupados por estudiante
                  estudiantes.map((est) => {
                    const mesesEstudiante = mesesFiltrados.filter((mes) => mes.estudiante === est.id)
                    if (mesesEstudiante.length === 0) return null

                    return (
                      <div key={est.id} className="mb-4">
                        <div className="bg-gray-100 p-3 border-b border-gray-200">
                          <h3 className="font-medium text-gray-800">
                            {est.nombre} - {est.grado}
                            {est.tieneConvenio && (
                              <Badge className="ml-2 bg-pink-100 text-pink-700 border-pink-200">Con convenio</Badge>
                            )}
                          </h3>
                        </div>
                        <div className="divide-y">
                          {mesesEstudiante.map((mes) => {
                            const isVencido = mes.estado === "pendiente" && estaVencido(mes.vencimiento || "")
                            const estado = isVencido ? "vencido" : mes.estado

                            return (
                              <div
                                key={mes.id}
                                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors ${
                                  mes.estado === "pagado" ? "opacity-75" : ""
                                }`}
                              >
                                <div className="flex items-start mb-3 sm:mb-0">
                                  {mes.estado === "pendiente" && (
                                    <Checkbox
                                      id={mes-${mes.id}}
                                      checked={mesesSeleccionados.includes(mes.id)}
                                      onCheckedChange={() => toggleMesSeleccionado(mes.id)}
                                      className="mr-3 mt-1"
                                      disabled={mes.estado === "pagado"}
                                    />
                                  )}
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium text-gray-800">{mes.nombre}</h3>
                                      {mes.incluye && (
                                        <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                                          + {mes.incluye}
                                        </Badge>
                                      )}
                                      <div className="ml-3">{getEstadoBadge(estado)}</div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {mes.estado === "pagado" ? (
                                        <span>Pagado el {mes.fechaPago}</span>
                                      ) : (
                                        <span>Vence el {mes.vencimiento}</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">Estudiante: {mes.nombreEstudiante}</div>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                  <div className="font-bold text-lg text-gray-800">${mes.monto.toFixed(2)}</div>
                                  {mes.interes && (
                                    <div className="text-sm text-red-500">
                                      + ${mes.interes.toFixed(2)} (10% interés)
                                    </div>
                                  )}
                                  {isVencido && (
                                    <div className="text-sm text-red-500 flex items-center">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Incluye 10% de interés
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  // Si hay filtro de estudiante, mostrar solo las mensualidades de ese estudiante
                  <div className="divide-y">
                    {mesesFiltrados.map((mes) => {
                      const isVencido = mes.estado === "pendiente" && estaVencido(mes.vencimiento || "")
                      const estado = isVencido ? "vencido" : mes.estado
                      const estudianteInfo = estudiantes.find((e) => e.id === mes.estudiante)

                      return (
                        <div
                          key={mes.id}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors ${
                            mes.estado === "pagado" ? "opacity-75" : ""
                          }`}
                        >
                          <div className="flex items-start mb-3 sm:mb-0">
                            {mes.estado === "pendiente" && (
                              <Checkbox
                                id={mes-${mes.id}}
                                checked={mesesSeleccionados.includes(mes.id)}
                                onCheckedChange={() => toggleMesSeleccionado(mes.id)}
                                className="mr-3 mt-1"
                                disabled={mes.estado === "pagado"}
                              />
                            )}
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-gray-800">{mes.nombre}</h3>
                                {mes.incluye && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                                    + {mes.incluye}
                                  </Badge>
                                )}
                                <div className="ml-3">{getEstadoBadge(estado)}</div>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {mes.estado === "pagado" ? (
                                  <span>Pagado el {mes.fechaPago}</span>
                                ) : (
                                  <span>Vence el {mes.vencimiento}</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">Estudiante: {mes.nombreEstudiante}</div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="font-bold text-lg text-gray-800">${mes.monto.toFixed(2)}</div>
                            {mes.interes && (
                              <div className="text-sm text-red-500">+ ${mes.interes.toFixed(2)} (10% interés)</div>
                            )}
                            {isVencido && (
                              <div className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Incluye 10% de interés
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="text-sm text-gray-700">Después del día 12 se aplica un 10% de interés</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total seleccionado</div>
                    <div className="text-2xl font-bold text-gray-800">${calcularTotal().toFixed(2)}</div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Formulario de pago */}
            <Card className="border-gray-200 shadow-md mt-6">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-pink-500" />
                  Realizar Pago
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Completa la información para procesar tu pago
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Resumen del pago */}
                {mesesSeleccionados.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">Resumen del Pago</Label>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      {estudiante && (
                        <div className="mb-3 pb-2 border-b border-gray-200">
                          <p className="font-medium text-gray-800">
                            Estudiante: {estudiantes.find((e) => e.id === estudiante)?.nombre}
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {mesesSeleccionados.map((mesId) => {
                          const mes = mesesColegiatura.find((m) => m.id === mesId)
                          if (!mes) return null

                          const isVencido = mes.estado === "pendiente" && estaVencido(mes.vencimiento || "")
                          const interesCalculado = isVencido && !mes.interes ? mes.monto * 0.1 : mes.interes || 0

                          return (
                            <div key={mesId}>
                              <div className="flex justify-between items-center text-gray-800">
                                <span>Colegiatura {mes.nombre}</span>
                                <span className="font-medium">${mes.monto.toFixed(2)}</span>
                              </div>
                              {interesCalculado > 0 && (
                                <div className="flex justify-between items-center text-red-500 text-sm">
                                  <span>+ Interés por pago tardío (10%)</span>
                                  <span className="font-medium">${interesCalculado.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                        <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-gray-800">
                          <span>Total a pagar:</span>
                          <span className="text-lg">${calcularTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">
                        Para solicitar factura, envíe un correo a{" "}
                        <span className="font-medium">facturacion@colegio.edu</span> con su comprobante de pago y datos
                        fiscales.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={handlePagoExitoso}
                  disabled={mesesSeleccionados.length === 0}
                >
                  <div className="flex items-center justify-center">
                    <svg viewBox="0 0 256 256" className="h-5 w-5 mr-2">
                      <path
                        d="M216.2,94.4l-32.7,32.7,13.1,13.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0l-13.1-13.1-17.4,17.4,26.2,26.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0L143.6,167l-17.4,17.4,13.1,13.1a8,8,0,0,1,0,11.3,8.1,8.1,0,0,1-11.3,0l-13.1-13.1L82.2,228.4a28,28,0,0,1-39.6-39.6L76.3,155l-13-13a8,8,0,0,1,11.3-11.3l13.1,13.1L105,126.4,78.9,100.2a8,8,0,0,1,11.3-11.3l26.1,26.2,17.4-17.4L120.6,84.6a8,8,0,0,1,11.3-11.3l13.1,13.1,32.7-32.7a28,28,0,0,1,39.6,39.6ZM54,200.1a12,12,0,1,0,17,0A12,12,0,0,0,54,200.1Z"
                        fill="#ffffff"
                      />
                    </svg>
                    <span className="text-white">Pagar con Mercado Pago: ${calcularTotal().toFixed(2)}</span>
                  </div>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Diálogo para mostrar el ticket */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Comprobante de Pago</DialogTitle>
          </DialogHeader>
          {ticketData && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">{ticketData.colegio}</h3>
                <p className="text-sm text-gray-600">{ticketData.direccion}</p>
                <p className="text-sm text-gray-600">Tel: {ticketData.telefono}</p>
              </div>

              <div className="border-t border-b border-gray-200 py-3 my-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Ticket:</span>
                  <span className="font-medium">{ticketData.ticket}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Fecha:</span>
                  <span>{ticketData.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estudiante:</span>
                  <span>{ticketData.estudiante}</span>
                </div>
              </div>

              <div className="mb-4">
                {ticketData.meses.map((mes: any, index: number) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between font-medium">
                      <span>Colegiatura {mes.nombre}:</span>
                      <span>${mes.monto.toFixed(2)}</span>
                    </div>
                    {(mes.interes || (mes.estado === "pendiente" && estaVencido(mes.vencimiento || ""))) && (
                      <div className="flex justify-between text-sm text-red-500">
                        <span>Interés (10%):</span>
                        <span>${(mes.interes || mes.monto * 0.1).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${ticketData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>¡Gracias por su pago!</p>
                <p>Este documento es un comprobante de pago válido.</p>
              </div>
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => window.print()} className="bg-pink-600 hover:bg-pink-700">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}