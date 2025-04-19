"use client" // Indica que este componente se ejecuta en el lado del cliente

import { SetStateAction, useState } from "react"; // Importa el hook useState de React
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"; // Importa componentes de tarjeta
import { Button } from "@/app/components/ui/button"; // Importa el componente de botón
import { Input } from "@/app/components/ui/input"; // Importa el componente de entrada
import { Label } from "@/app/components/ui/label"; // Importa el componente de etiqueta
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"; // Importa componentes de selección
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"; // Importa componentes de pestañas
import { CreditCard, CheckCircle2, DollarSign, AlertCircle, Clock, Calendar, Search, Receipt, Building2, ChevronUp, ChevronDown } from "lucide-react"; // Importa íconos de lucide-react
import { createCheckoutSession } from '@/app/actions'
import { useToast } from '@/app/components/ui/use-toast'
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@radix-ui/react-checkbox";


// Componente principal para la página de colegiatura
export default function ColegiaturaPage() {
  // Estados para manejar la información del formulario
  const [metodo, setMetodo] = useState("tarjeta"); // Estado para el método de pago
  const [monto, setMonto] = useState("1500.00"); // Estado para el monto a pagar
  const [pagando, setPagando] = useState(false); // Estado para indicar si se está procesando el pago

  // const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const amount = 1500.00

  //     const url = await createCheckoutSession(Number.parseFloat(amount))

  //     if (url) {
  //       window.location.href = url
  //     } else {
  //       throw new Error('No se pudo crear la sesion de pago.')
  //     }
  //   } catch (error) {
  //     console.error('Error al procesar el pago: ', error)
  //     toast({
  //       title: 'Error',
  //       description: 'Ocurrio un error al procesar el pago. Intente nuevamente.',
  //       variant: 'destructive'
  //     })
  //   } finally {
  //     setIsLoading(false);
  //   }

  // }

  // // Función para manejar el proceso de pago
  // const handlePagar = () => {
  //   setPagando(true); // Cambia el estado a "pagando"
  //   // Simulación de proceso de pago
  //   setTimeout(() => {
  //     setPagando(false); // Cambia el estado a "no pagando"
  //     setPagado(true); // Cambia el estado a "pagado"
  //     // Resetear después de mostrar confirmación
  //     setTimeout(() => {
  //       setPagado(false); // Resetea el estado de "pagado" después de 3 segundos
  //     }, 3000);
  //   }, 2000);
  // };

  const [estudiante, setEstudiante] = useState("")
  const [mesesSeleccionados, setMesesSeleccionados] = useState<string[]>([])
  const [facturar, setFacturar] = useState(false)
  const [mostrarFacturacion, setMostrarFacturacion] = useState(false)
  const [pagado, setPagado] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [filtroEstudiante, setFiltroEstudiante] = useState("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")
  const [busqueda, setBusqueda] = useState("")

  // Datos de ejemplo
  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A", monto: "1500.00", tieneConvenio: true, descuento: "10%" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B", monto: "1500.00", tieneConvenio: false },
  ]

  const mesesColegiatura = [
    { id: "ene", nombre: "Enero", monto: 1500, estado: "pagado", fechaPago: "10/01/2024", incluye: "Libros" },
    { id: "feb", nombre: "Febrero", monto: 1500, estado: "pagado", fechaPago: "08/02/2024" },
    { id: "mar", nombre: "Marzo", monto: 1500, estado: "pagado", fechaPago: "12/03/2024", interes: 150 },
    { id: "abr", nombre: "Abril", monto: 1500, estado: "pagado", fechaPago: "09/04/2024" },
    { id: "may", nombre: "Mayo", monto: 1500, estado: "pendiente", vencimiento: "10/05/2024" },
    { id: "ago", nombre: "Agosto", monto: 1500, estado: "pendiente", vencimiento: "10/08/2024" },
    { id: "sep", nombre: "Septiembre", monto: 1500, estado: "pendiente", vencimiento: "10/09/2024" },
    { id: "oct", nombre: "Octubre", monto: 1500, estado: "pendiente", vencimiento: "10/10/2024" },
    { id: "nov", nombre: "Noviembre", monto: 1500, estado: "pendiente", vencimiento: "10/11/2024" },
    { id: "dic", nombre: "Diciembre", monto: 1500, estado: "pendiente", vencimiento: "10/12/2024" },
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

  const handlePagoExitoso = () => {
    setPagado(true)
    // Resetear después de mostrar confirmación
    setTimeout(() => {
      setPagado(false)
    }, 5000)
  }

  const toggleMesSeleccionado = (mesId: string) => {
    if (mesesSeleccionados.includes(mesId)) {
      setMesesSeleccionados(mesesSeleccionados.filter((id) => id !== mesId))
    } else {
      setMesesSeleccionados([...mesesSeleccionados, mesId])
    }
  }

  const calcularTotal = () => {
    let total = 0
    mesesSeleccionados.forEach((mesId) => {
      const mes = mesesColegiatura.find((m) => m.id === mesId)
      if (mes) {
        total += mes.monto
        if (mes.interes) total += mes.interes
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
  const mesesFiltrados = mesesColegiatura.filter((mes) => {
    // Filtro por estado
    if (filtroEstado !== "todos" && mes.estado !== filtroEstado) return false

    // Filtro por periodo
    if (filtroPeriodo === "verano" && (mes.id === "jun" || mes.id === "jul")) return true
    if (filtroPeriodo === "regular" && mes.id !== "jun" && mes.id !== "jul") return true
    if (filtroPeriodo !== "todos" && filtroPeriodo !== "verano" && filtroPeriodo !== "regular") return false

    // Filtro por búsqueda
    if (busqueda && !mes.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false

    return true
  })

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
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="10"
                        strokeDasharray="282.7"
                        strokeDashoffset="70.7"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">75%</span>
                      <span className="text-xs text-gray-500">Pagos al día</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-800">
                    <span className="text-sm font-medium">Pagos realizados</span>
                    <span className="font-bold">4/10</span>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: "40%" }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <span className="text-xs text-gray-500">Pagado</span>
                      <span className="block text-lg font-bold text-green-600">$6,000</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <span className="text-xs text-gray-500">Pendiente</span>
                      <span className="block text-lg font-bold text-amber-600">$9,000</span>
                    </div>
                  </div>
                </div>

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
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Pendiente
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Agosto 2024</p>
                          <p className="text-sm text-gray-600">Vence: 10/08/2024</p>
                        </div>
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                          Próximo
                        </Badge>
                      </div>
                    </div>
                  </div>
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
                        placeholder="Buscar..."
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
                <div className="divide-y">
                  {mesesFiltrados.map((mes) => {
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
                              id={`mes-${mes.id}`}
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
                {/* Selección de estudiante */}
                <div className="space-y-2">
                  <Label htmlFor="estudiante" className="text-gray-700">
                    Estudiante
                  </Label>
                  <Select value={estudiante} onValueChange={setEstudiante}>
                    <SelectTrigger className="h-10 text-gray-800">
                      <SelectValue placeholder="Seleccione un estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {estudiantes.map((est) => (
                        <SelectItem key={est.id} value={est.id}>
                          {est.nombre} - {est.grado}
                          {est.tieneConvenio && " (Con convenio)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Resumen del pago */}
                {mesesSeleccionados.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">Resumen del Pago</Label>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="space-y-2">
                        {mesesSeleccionados.map((mesId) => {
                          const mes = mesesColegiatura.find((m) => m.id === mesId)
                          if (!mes) return null
                          return (
                            <div key={mesId} className="flex justify-between items-center text-gray-800">
                              <span>Colegiatura {mes.nombre}</span>
                              <span className="font-medium">${mes.monto.toFixed(2)}</span>
                            </div>
                          )
                        })}
                        {mesesSeleccionados.some((mesId) => {
                          const mes = mesesColegiatura.find((m) => m.id === mesId)
                          return mes && mes.interes
                        }) && (
                          <div className="flex justify-between items-center text-red-500">
                            <span>Intereses por pago tardío</span>
                            <span className="font-medium">
                              $
                              {mesesSeleccionados
                                .reduce((total, mesId) => {
                                  const mes = mesesColegiatura.find((m) => m.id === mesId)
                                  return total + (mes?.interes || 0)
                                }, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-gray-800">
                          <span>Total a pagar:</span>
                          <span className="text-lg">${calcularTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Opción de facturación */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="facturar"
                    checked={facturar}
                    onCheckedChange={(checked) => {
                      setFacturar(checked === true)
                      if (checked === true) setMostrarFacturacion(true)
                    }}
                  />
                  <Label htmlFor="facturar" className="font-medium cursor-pointer flex items-center text-gray-700">
                    <Receipt className="h-4 w-4 mr-2 text-pink-500" />
                    Requiero factura
                  </Label>
                </div>

                {/* Datos de facturación */}
                {facturar && mostrarFacturacion && (
                  <div className="space-y-3 border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium flex items-center text-gray-800">
                        <Building2 className="h-4 w-4 mr-2 text-pink-500" />
                        Datos de Facturación
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMostrarFacturacion(!mostrarFacturacion)}
                        className="h-8 px-2 text-gray-700"
                      >
                        {mostrarFacturacion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="razonSocial" className="text-gray-700">
                          Razón Social
                        </Label>
                        <Input id="razonSocial" placeholder="Nombre o Razón Social" className="text-gray-800" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rfc" className="text-gray-700">
                          RFC
                        </Label>
                        <Input id="rfc" placeholder="RFC con homoclave" className="text-gray-800" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cfdi" className="text-gray-700">
                          Uso de CFDI
                        </Label>
                        <Select defaultValue="G03">
                          <SelectTrigger className="text-gray-800">
                            <SelectValue placeholder="Seleccione uso de CFDI" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="G03">G03 - Gastos en general</SelectItem>
                            <SelectItem value="P01">P01 - Por definir</SelectItem>
                            <SelectItem value="D04">D04 - Gastos educativos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Correo Electrónico
                        </Label>
                        <Input id="email" type="email" placeholder="Para envío de factura" className="text-gray-800" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-200 p-4">
                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={handlePagoExitoso}
                  disabled={!estudiante || mesesSeleccionados.length === 0}
                >
                  <span className="text-white">Pagar ${calcularTotal().toFixed(2)}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
