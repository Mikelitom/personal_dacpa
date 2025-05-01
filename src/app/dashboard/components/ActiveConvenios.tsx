"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import { CheckCircle } from "lucide-react";
import type { Convenio, Alumno } from "../types";

interface ActiveConveniosProps {
  alumnos: Alumno[];
  convenios: Convenio[];
}

export function ActiveConvenios({ alumnos, convenios }: ActiveConveniosProps) {
  const conveniosActivos = convenios.filter((c) => c.firmado);

  const alumnosConConvenio = conveniosActivos
    .map((convenio) => {
      const alumno = alumnos.find((a) => a.id_alumno === convenio.id_alumno);
      return alumno ? { alumno, convenio } : null;
    })
    .filter(Boolean) as { alumno: Alumno; convenio: Convenio }[];

  if (alumnosConConvenio.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No hay convenios activos</p>
      </div>
    );
  }

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800">
          Convenios Activos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {alumnosConConvenio.map(({ alumno, convenio }) => (
            <ConvenioItem
              key={alumno.id_alumno}
              student={alumno}
              convenio={convenio}
            />
          ))}
          <div className="text-sm text-gray-500 mt-2">
            Los convenios se renuevan cada ciclo escolar. Para más información,
            contacte a administración.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ConvenioItemProps {
  student: Alumno;
  convenio: Convenio;
}

function ConvenioItem({ student, convenio }: ConvenioItemProps) {
  return (
    <div className="p-3 bg-pink-100 rounded-lg border border-pink-100">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
        <div>
          <h4 className="font-medium text-gray-800">{student.nombre}</h4>
          <div className="mt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Colegiatura regular:</span>
              <span className="text-gray-700 line-through ml-15">1500.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-500">Colegiatura con convenio: </span>
              <span className="text-pink-600 ml-15">
                ${1500 + (1500 * convenio.porcentaje_incremento) / 100}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
