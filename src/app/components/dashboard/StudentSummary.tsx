"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Database } from "@/app/lib/types";

type Alumno = Database['public']['Tables']['Alumno']['Row']

interface StudentSummaryProps {
  students: Alumno[];
}

export function StudentSummary({ students }: StudentSummaryProps) {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800">Resumen de Estudiantes</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {students.map((student) => (
            <StudentItem key={student.id_alumno} student={student} />
          ))}
        </div>
        <div className="mt-4">
          <Link href="/dashboard/perfil">
            <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
              Ver Perfiles Completos
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface StudentItemProps {
  student: Alumno;
}

function StudentItem({ student }: StudentItemProps) {
  return (
    <div
      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      {/* <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border border-gray-200">
        <Image
          src={student. || "/placeholder.svg"}
          alt={student.nombre}
          width={48}
          height={48}
          className="object-cover"
        />
      </div> */}
      <div>
        <h4 className="font-medium text-gray-800">{student.nombre}</h4>
        <p className="text-sm text-gray-500">{student.grado}</p>
        {student.convenio ? (
          <Badge className="mt-1 bg-pink-100 text-pink-700 border-pink-200">
            {student.convenio}
          </Badge>
        ): (<></>)}
      </div>
    </div>
  );
}