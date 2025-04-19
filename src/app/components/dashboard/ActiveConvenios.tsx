"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Student } from "@/app/types/user";

interface ActiveConveniosProps {
  students: Student[];
}

export function ActiveConvenios({ students }: ActiveConveniosProps) {
  const studentsWithConvenio = students.filter((student) => student.hasConvenio);
  const hasConvenios = studentsWithConvenio.length > 0;

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
              <ConvenioItem key={student.id} student={student} />
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
  student: Student;
}

function ConvenioItem({ student }: ConvenioItemProps) {
  return (
    <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
        <div>
          <h4 className="font-medium text-gray-800">{student.name}</h4>
          <p className="text-gray-600 text-sm">{student.convenioType}</p>
          <div className="mt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Colegiatura regular:</span>
              <span className="text-gray-700 line-through">
                ${student.colegiaturaRegular?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-500">Colegiatura con convenio:</span>
              <span className="text-pink-600">
                ${student.colegiaturaConvenio?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}