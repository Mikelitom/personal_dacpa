// src/components/perfil/tabs/Estudiantes.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Calendar, BookOpen } from "lucide-react"
import { Database } from "@/app/lib/types"

type Alumno = Database['public']['Tables']['Alumno']['Row']

interface EstudiantesProps {
  hijosData: Alumno[];
}

export function Estudiantes({ hijosData }: EstudiantesProps) {
  // Si no hay hijos, mostrar mensaje
  if (!hijosData || hijosData.length === 0) {
    return (
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-gray-800">Estudiantes</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No hay estudiantes registrados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-gray-800">Estudiantes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={hijosData[0]?.id_alumno.toString()} className="w-full">
          <TabsList className="w-full rounded-none border-b">
            {hijosData.map((hijo) => (
              <TabsTrigger
                key={hijo.id_alumno}
                value={hijo.id_alumno.toString()}
                className="flex-1 py-3 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:shadow-none text-gray-700"
              >
                {(hijo.nombre?.split(" ")[0] || "Alumno")} - {hijo.grado}
                {hijo.grupo}
                {hijo.convenio && <span className="ml-1 text-pink-600">★</span>}
              </TabsTrigger>
            ))}
          </TabsList>

          {hijosData.map((hijo) => (
            <TabsContent key={hijo.id_alumno} value={hijo.id_alumno.toString()} className="p-0">
              <StudentDetail student={hijo} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface StudentDetailProps {
  student: Alumno;
}

function StudentDetail({ student }: StudentDetailProps) {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <StudentCard student={student} />
        </div>
        <div className="md:w-2/3">
          <AcademicInfo student={student} />
        </div>
      </div>
    </div>
  )
}

function StudentCard({ student }: { student: Alumno }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
          <span className="text-3xl font-bold text-pink-300">
            {student.nombre?.charAt(0) || "A"}
          </span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
        {student.nombre} {student.apellido_paterno} {student.apellido_materno}
      </h3>
      <div className="flex justify-center gap-2 mb-4">
        <Badge className="bg-pink-100 text-pink-700 border-pink-200">
          {student.grado}
          {student.grupo}
        </Badge>
        {student.convenio && (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Con convenio</Badge>
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Matrícula:</span>
          <span className="text-gray-800 font-medium">{student.id_alumno}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Fecha de nacimiento:</span>
          <span className="text-gray-800 font-medium">{student.fecha_nacimiento}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Estado:</span>
          <span className="text-gray-800 font-medium">{student.estado}</span>
        </div>
      </div>
    </div>
  )
}

function AcademicInfo({ student }: { student: Alumno }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-full">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-pink-500" />
        Información Académica
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AcademicInfoItem label="Grado y Grupo" value={`${student.grado}${student.grupo}`} />
        <AcademicInfoItem label="Ciclo Escolar" value={student.ciclo_escolar || "2024-2025"} />
        <AcademicInfoItem label="Fecha de inscripción" value={student.fecha_inscripción || "No disponible"} />
        <AcademicInfoItem label="Estado" value={student.estado} />
      </div>

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
  )
}

function AcademicInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  )
}