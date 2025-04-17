"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  FileText,
  Calendar,
  GraduationCap,
  Clock,
  CreditCard,
  BookOpen,
} from "lucide-react"

export default function PerfilPage() {
  // Datos de ejemplo
  const [padreData, setPadreData] = useState({
    nombre: "Juan Pérez Rodríguez",
    email: "juan.perez@gmail.com",
    telefono: "555-123-4567",
    direccion: "Calle Principal #123, Colonia Centro",
    ciudad: "Ciudad de México",
    codigoPostal: "01234",
  })

  const hijosData = [
    {
      id: 1,
      nombre: "Ana Pérez González",
      grado: "1°",
      grupo: "A",
      matricula: "EST2024-001",
      fechaNacimiento: "15/05/2016",
      padre: "Juan Pérez Rodríguez",
      madre: "María González López",
      imagen: "/placeholder.svg?height=200&width=200",
      convenio: {
        tipo: "Convenio por atraso",
        descuento: "10%",
        vigencia: "01/05/2024 - 31/05/2024",
      },
      historialPagos: [
        { mes: "Enero", estado: "Pagado", fecha: "10/01/2024", monto: 1500 },
        { mes: "Febrero", estado: "Pagado", fecha: "08/02/2024", monto: 1500 },
        { mes: "Marzo", estado: "Pagado", fecha: "12/03/2024", monto: 1650 },
        { mes: "Abril", estado: "Pagado", fecha: "09/04/2024", monto: 1500 },
        { mes: "Mayo", estado: "Pendiente", vencimiento: "10/05/2024", monto: 1500 },
      ],
    },
    {
      id: 2,
      nombre: "Carlos Pérez González",
      grado: "3°",
      grupo: "B",
      matricula: "EST2024-002",
      fechaNacimiento: "22/08/2014",
      padre: "Juan Pérez Rodríguez",
      madre: "María González López",
      imagen: "/placeholder.svg?height=200&width=200",
      historialPagos: [
        { mes: "Enero", estado: "Pagado", fecha: "10/01/2024", monto: 1500 },
        { mes: "Febrero", estado: "Pagado", fecha: "08/02/2024", monto: 1500 },
        { mes: "Marzo", estado: "Pagado", fecha: "12/03/2024", monto: 1650 },
        { mes: "Abril", estado: "Pagado", fecha: "09/04/2024", monto: 1500 },
        { mes: "Mayo", estado: "Pendiente", vencimiento: "10/05/2024", monto: 1500 },
      ],
    },
  ]

  // Estado para controlar el modo de edición
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ ...padreData })
  const [activeTab, setActiveTab] = useState("info")

  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData({
      ...editData,
      [name]: value,
    })
  }

  // Función para guardar cambios
  const saveChanges = () => {
    setPadreData(editData)
    setEditMode(false)
  }

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditData({ ...padreData })
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Perfil Familiar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel izquierdo - Información del padre */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200 shadow-md h-full">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {padreData.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <CardTitle className="text-center text-gray-800">{padreData.nombre}</CardTitle>
              <p className="text-center text-gray-500 text-sm">Padre/Tutor</p>
            </CardHeader>

            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "info" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "info" ? "bg-pink-600 text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("info")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Información Personal
                </Button>
                <Button
                  variant={activeTab === "estudiantes" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "estudiantes" ? "bg-pink-600 text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("estudiantes")}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Estudiantes
                </Button>
                <Button
                  variant={activeTab === "pagos" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "pagos" ? "bg-pink-600 text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("pagos")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Historial de Pagos
                </Button>
                <Button
                  variant={activeTab === "convenios" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "convenios" ? "bg-pink-600 text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("convenios")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Convenios
                </Button>
                <Button
                  variant={activeTab === "documentos" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === "documentos" ? "bg-pink-600 text-white" : "text-gray-700"}`}
                  onClick={() => setActiveTab("documentos")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Documentos
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Panel derecho - Contenido según la pestaña seleccionada */}
        <div className="lg:col-span-3">
          {activeTab === "info" && (
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-800">Información Personal</CardTitle>
                  {!editMode && (
                    <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="text-gray-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-gray-700">
                          Nombre completo
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={editData.nombre}
                          onChange={handleChange}
                          className="border-gray-200 text-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Correo electrónico
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editData.email}
                          onChange={handleChange}
                          className="border-gray-200 text-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono" className="text-gray-700">
                          Teléfono
                        </Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          value={editData.telefono}
                          onChange={handleChange}
                          className="border-gray-200 text-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion" className="text-gray-700">
                          Dirección
                        </Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          value={editData.direccion}
                          onChange={handleChange}
                          className="border-gray-200 text-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ciudad" className="text-gray-700">
                          Ciudad
                        </Label>
                        <Input
                          id="ciudad"
                          name="ciudad"
                          value={editData.ciudad}
                          onChange={handleChange}
                          className="border-gray-200 text-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="codigoPostal" className="text-gray-700">
                          Código Postal
                        </Label>
                        <Input
                          id="codigoPostal"
                          name="codigoPostal"
                          value={editData.codigoPostal}
                          onChange={handleChange}
                          className="border-gray-200 text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Nombre completo</p>
                          <p className="font-medium text-gray-800">{padreData.nombre}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Correo electrónico</p>
                          <p className="font-medium text-gray-800">{padreData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-medium text-gray-800">{padreData.telefono}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Dirección</p>
                          <p className="font-medium text-gray-800">{padreData.direccion}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Ciudad</p>
                          <p className="font-medium text-gray-800">{padreData.ciudad}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Código Postal</p>
                          <p className="font-medium text-gray-800">{padreData.codigoPostal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {editMode && (
                <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
                  <div className="flex gap-2 w-full justify-end">
                    <Button onClick={cancelEdit} variant="outline" className="text-gray-700">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={saveChanges} className="bg-pink-600 hover:bg-pink-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}

          {activeTab === "estudiantes" && (
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Estudiantes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={hijosData[0].id.toString()} className="w-full">
                  <TabsList className="w-full rounded-none border-b">
                    {hijosData.map((hijo) => (
                      <TabsTrigger
                        key={hijo.id}
                        value={hijo.id.toString()}
                        className="flex-1 py-3 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:shadow-none text-gray-700"
                      >
                        {hijo.nombre.split(" ")[0]} - {hijo.grado}
                        {hijo.grupo}
                        {hijo.convenio && <span className="ml-1 text-pink-600">★</span>}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {hijosData.map((hijo) => (
                    <TabsContent key={hijo.id} value={hijo.id.toString()} className="p-0">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex justify-center mb-4">
                                <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-md">
                                  <Image
                                    src={hijo.imagen || "/placeholder.svg"}
                                    alt={hijo.nombre}
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{hijo.nombre}</h3>
                              <div className="flex justify-center gap-2 mb-4">
                                <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                                  {hijo.grado}
                                  {hijo.grupo}
                                </Badge>
                                {hijo.convenio && (
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Con convenio</Badge>
                                )}
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Matrícula:</span>
                                  <span className="text-gray-800 font-medium">{hijo.matricula}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Fecha de nacimiento:</span>
                                  <span className="text-gray-800 font-medium">{hijo.fechaNacimiento}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="md:w-2/3">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-full">
                              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                                Información Académica
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500">Grado y Grupo</p>
                                  <p className="font-medium text-gray-800">
                                    {hijo.grado}
                                    {hijo.grupo}
                                  </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500">Ciclo Escolar</p>
                                  <p className="font-medium text-gray-800">2023-2024</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500">Padre</p>
                                  <p className="font-medium text-gray-800">{hijo.padre}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-500">Madre</p>
                                  <p className="font-medium text-gray-800">{hijo.madre}</p>
                                </div>
                              </div>

                              {hijo.convenio && (
                                <div className="mb-6">
                                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-pink-500" />
                                    Convenio Activo
                                  </h4>
                                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="font-medium text-gray-800">{hijo.convenio.tipo}</p>
                                    <p className="text-sm text-gray-600 mt-1">Descuento: {hijo.convenio.descuento}</p>
                                    <p className="text-sm text-gray-600 mt-1">Vigencia: {hijo.convenio.vigencia}</p>
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                                  <BookOpen className="h-5 w-5 mr-2 text-pink-500" />
                                  Materiales
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <Badge variant="outline" className="justify-start py-1.5 text-gray-700">
                                    Libros entregados
                                  </Badge>
                                  <Badge variant="outline" className="justify-start py-1.5 text-gray-700">
                                    Uniformes completos
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {activeTab === "pagos" && (
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue={hijosData[0].id.toString()} className="w-full">
                  <TabsList className="w-full mb-4">
                    {hijosData.map((hijo) => (
                      <TabsTrigger
                        key={hijo.id}
                        value={hijo.id.toString()}
                        className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-gray-700"
                      >
                        {hijo.nombre.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {hijosData.map((hijo) => (
                    <TabsContent key={hijo.id} value={hijo.id.toString()}>
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mes
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Monto
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {hijo.historialPagos.map((pago, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{pago.mes}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {pago.estado === "Pagado" ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">Pagado</Badge>
                                  ) : (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pendiente</Badge>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                  {pago.fecha || pago.vencimiento}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                  ${pago.monto.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {pago.estado === "Pagado" ? (
                                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 mr-1"
                                      >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                      </svg>
                                      Recibo
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 mr-1"
                                      >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M16 12h-6"></path>
                                        <path d="M10 16v-8"></path>
                                        <path d="M14 16v-8"></path>
                                      </svg>
                                      Pagar
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {activeTab === "convenios" && (
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Convenios por Atraso</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {hijosData.some((hijo) => hijo.convenio) ? (
                  <div className="space-y-6">
                    {hijosData
                      .filter((hijo) => hijo.convenio)
                      .map((hijo) => (
                        <div key={hijo.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-start">
                            <div className="mr-4">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-100">
                                <Image
                                  src={hijo.imagen || "/placeholder.svg"}
                                  alt={hijo.nombre}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800">{hijo.nombre}</h3>
                              <p className="text-sm text-gray-500">
                                {hijo.grado}
                                {hijo.grupo}
                              </p>

                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-gray-800">{hijo.convenio?.tipo}</h4>
                                <p className="text-sm text-gray-600 mt-1">Descuento: {hijo.convenio?.descuento}</p>
                                <p className="text-sm text-gray-600 mt-1">Vigencia: {hijo.convenio?.vigencia}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">Información sobre convenios</h4>
                      <p className="text-sm text-gray-600">
                        Los convenios por atraso son acuerdos especiales que permiten a los padres de familia
                        regularizar sus pagos pendientes con un descuento aplicado.
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Para solicitar un convenio, por favor acuda a la administración del colegio con una
                        identificación oficial.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No hay convenios activos</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Actualmente no tiene convenios por atraso activos. Si necesita un convenio especial, por favor
                      contacte a la administración.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "documentos" && (
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Documentos</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Documentos Disponibles</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-pink-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">Reglamento Escolar</p>
                            <p className="text-xs text-gray-500">PDF - 2.3 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Descargar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-pink-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">Calendario Escolar 2023-2024</p>
                            <p className="text-xs text-gray-500">PDF - 1.5 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Descargar
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-pink-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">Lista de Útiles Escolares</p>
                            <p className="text-xs text-gray-500">PDF - 0.8 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Documentos Requeridos</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-amber-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">Comprobante de Domicilio</p>
                            <p className="text-xs text-gray-500">Pendiente de entrega</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          Subir
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">Acta de Nacimiento</p>
                            <p className="text-xs text-gray-500">Entregado el 15/01/2024</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Entregado</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
