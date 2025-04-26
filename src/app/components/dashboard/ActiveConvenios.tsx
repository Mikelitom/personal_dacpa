"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Database } from "@/app/lib/types";
import { useEffect, useState } from "react";

type Alumno = Database['public']['Tables']['Alumno']['Row']
type Convenio = Database['public']['Tables']['Convenio']['Row']

interface ActiveConveniosProps {
  students: Alumno[];
}

export function ActiveConvenios({ students }: ActiveConveniosProps) {
  const studentsWithConvenio = students.filter((student) => student.convenio);
  const hasConvenios = studentsWithConvenio.length > 0;
  const [ convenios, setConvenios ] = useState<Record<string, Convenio>>({})

  const fetchConvenioById = async (idAlumno: number) => {
    try {
      const response = await fetch(`/api/convenios/${idAlumno}/by_id`)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch convenio')        
      }

      return await response.json();
    } catch (error) {
      console.error('Error: ', error)
    } 
  }

  useEffect(() => {
    async function loadConvenios() {
      for (const alumno of studentsWithConvenio) {
        const convenio = await fetchConvenioById(alumno.id_alumno);

        if (convenio) {
          setConvenios(prev => ({
            ...prev,
            [alumno.id_alumno]: convenio
          }))
        }
      }
    }

    loadConvenios();
  })

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800">
          Convenios Activos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {hasConvenios ? (
          <div className="space-y-4">
            {studentsWithConvenio.map((student) => (
              <ConvenioItem key={student.id_alumno} student={student} convenio={convenios[student.id_alumno]}/>
            ))}
            <div className="text-sm text-gray-500 mt-2">
              Los convenios se renuevan cada ciclo escolar. Para más
              información, contacte a administración.
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No hay convenios activos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ConvenioItemProps {
  student: Alumno;
  convenio: Convenio
}

function ConvenioItem({ student, convenio }: ConvenioItemProps) {
  return (
    <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
        <div>
          <h4 className="font-medium text-gray-800">{student.nombre}</h4>
          <p className="text-gray-600 text-sm">{convenio?.id_convenio}</p>
          <div className="mt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Colegiatura regular:</span>
              <span className="text-gray-700 line-through">
                1500.00
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-500">Colegiatura con convenio:</span>
              <span className="text-pink-600">
                ${
                  1500 + ((1500 * convenio?.porcentaje_incremento)/100)
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}