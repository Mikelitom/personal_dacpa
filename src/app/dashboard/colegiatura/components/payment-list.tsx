"use client"

import { useState } from "react"
import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { AlertCircle, Calendar, Search } from "lucide-react"
import type { Alumno, PagoColegiatura } from "../../types"

interface PaymentListProps {
  alumnos: Alumno[]
  pagos: PagoColegiatura[]
  mesesSeleccionados: string[]
  toggleMesSeleccionado: (mesId: string) => void
  calcularTotal: () => number
}

export function PaymentList({
  alumnos,
  pagos,
  mesesSeleccionados,
  toggleMesSeleccionado,
  calcularTotal,
}: PaymentListProps) {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroEstudiante, setFiltroEstudiante] = useState("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")

  // Verificar si la fecha actual es posterior a la fecha de vencimiento
  const estaVencido = (fechaPago: string) => {
    if (!fechaPago) return false
    const fechaVencimiento = new Date(fechaPago)
    const hoy = new Date()
    return hoy > fechaVencimiento
  }

  // Filtrar pagos según los criterios seleccionados
  const filtrarPagos = () => {
    return pagos.filter((pago) => {
      // Filtro por búsqueda
      if (busqueda) {
        const searchLower = busqueda.toLowerCase()
        const matchesConcepto = pago.concepto.toLowerCase().includes(searchLower)

        const alumno = alumnos.find((a) => a.id_alumno === pago.id_alumno)
        const nombreCompleto = alumno
          ? `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase()
          : ""

        const matchesEstudiante = nombreCompleto.includes(searchLower)

        if (!matchesConcepto && !matchesEstudiante) return false
      }

      // Filtro por estado
      if (filtroEstado !== "todos") {
        if (filtroEstado === "vencido") {
          if (!(pago.estado === "pendiente" && estaVencido(pago.fecha_pago))) return false
        } else if (pago.estado !== filtroEstado) {
          return false
        }
      }

      // Filtro por estudiante
      if (filtroEstudiante !== "todos") {
        const alumnoId = Number.parseInt(filtroEstudiante)
        if (pago.id_alumno !== alumnoId) return false
      }

      // Filtro por periodo (simplificado - se podría mejorar con datos reales)
      if (filtroPeriodo === "verano") {
        const mes = new Date(pago.fecha_pago).getMonth()
        if (mes !== 5 && mes !== 6) return false // Junio y Julio
      } else if (filtroPeriodo === "regular") {
        const mes = new Date(pago.fecha_pago).getMonth()
        if (mes === 5 || mes === 6) return false // Excluir Junio y Julio
      }

      return true
    })
  }

  const pagosFiltrados = filtrarPagos()

  // Agrupar pagos por estudiante
  const pagosPorEstudiante = pagosFiltrados.reduce(
    (acc, pago) => {
      if (!acc[pago.id_alumno]) {
        acc[pago.id_alumno] = []
      }
      acc[pago.id_alumno].push(pago)
      return acc
    },
    {} as Record<number, PagoColegiatura[]>,
  )

  const getEstadoBadge = (estado: string, fechaPago: string) => {
    const isVencido = estado === "pendiente" && estaVencido(fechaPago)

    switch (isVencido ? "vencido" : estado) {
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

  return (
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
                placeholder="Buscar por concepto o estudiante..."
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
                {alumnos.map((alumno) => (
                  <SelectItem key={alumno.id_alumno} value={alumno.id_alumno.toString()}>
                    {alumno.nombre}
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
        {filtroEstudiante === "todos" ? (
          // Si no hay filtro de estudiante, mostrar agrupados por estudiante
          Object.entries(pagosPorEstudiante).map(([alumnoId, pagosList]) => {
            const alumno = alumnos.find((a) => a.id_alumno === Number.parseInt(alumnoId))
            if (!alumno) return null

            const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
            const tieneConvenio = alumno.convenio

            return (
              <div key={alumnoId} className="mb-4">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">
                    {nombreCompleto} - {alumno.grado}
                    {alumno.grupo}
                    {tieneConvenio && (
                      <Badge className="ml-2 bg-pink-100 text-pink-700 border-pink-200">Con convenio</Badge>
                    )}
                  </h3>
                </div>
                <div className="divide-y">
                  {pagosList.map((pago) => {
                    const isVencido = pago.estado === "pendiente" && estaVencido(pago.fecha_pago)
                    const estado = isVencido ? "vencido" : pago.estado
                    const interes = isVencido ? pago.monto * 0.1 : 0

                    return (
                      <div
                        key={pago.id_colegiatura}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors ${
                          pago.estado === "pagado" ? "opacity-75" : ""
                        }`}
                      >
                        <div className="flex items-start mb-3 sm:mb-0">
                          {pago.estado === "pendiente" && (
                            <Checkbox
                              id={`pago-${pago.id_colegiatura}`}
                              checked={mesesSeleccionados.includes(pago.id_colegiatura.toString())}
                              onCheckedChange={() => toggleMesSeleccionado(pago.id_colegiatura.toString())}
                              className="mr-3 mt-1"
                              disabled={pago.estado === "pagado"}
                            />
                          )}
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-gray-800">{pago.concepto}</h3>
                              <div className="ml-3">{getEstadoBadge(estado, pago.fecha_pago)}</div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {pago.estado === "pagado" ? (
                                <span>Pagado el {new Date(pago.fecha_pago).toLocaleDateString()}</span>
                              ) : (
                                <span>Vence el {new Date(pago.fecha_pago).toLocaleDateString()}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">Estudiante: {nombreCompleto}</div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <div className="font-bold text-lg text-gray-800">${pago.monto.toFixed(2)}</div>
                          {interes > 0 && (
                            <div className="text-sm text-red-500">+ ${interes.toFixed(2)} (10% interés)</div>
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
            {pagosFiltrados.map((pago) => {
              const isVencido = pago.estado === "pendiente" && estaVencido(pago.fecha_pago)
              const estado = isVencido ? "vencido" : pago.estado
              const interes = isVencido ? pago.monto * 0.1 : 0

              const alumno = alumnos.find((a) => a.id_alumno === pago.id_alumno)
              const nombreCompleto = alumno
                ? `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
                : "Alumno"

              return (
                <div
                  key={pago.id_colegiatura}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors ${
                    pago.estado === "pagado" ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start mb-3 sm:mb-0">
                    {pago.estado === "pendiente" && (
                      <Checkbox
                        id={`pago-${pago.id_colegiatura}`}
                        checked={mesesSeleccionados.includes(pago.id_colegiatura.toString())}
                        onCheckedChange={() => toggleMesSeleccionado(pago.id_colegiatura.toString())}
                        className="mr-3 mt-1"
                        disabled={pago.estado === "pagado"}
                      />
                    )}
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800">{pago.concepto}</h3>
                        <div className="ml-3">{getEstadoBadge(estado, pago.fecha_pago)}</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {pago.estado === "pagado" ? (
                          <span>Pagado el {new Date(pago.fecha_pago).toLocaleDateString()}</span>
                        ) : (
                          <span>Vence el {new Date(pago.fecha_pago).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Estudiante: {nombreCompleto}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <div className="font-bold text-lg text-gray-800">${pago.monto.toFixed(2)}</div>
                    {interes > 0 && <div className="text-sm text-red-500">+ ${interes.toFixed(2)} (10% interés)</div>}
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
  )
}
