import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/card";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Database } from "@/app/lib/types";

type Alumno = Database['public']['Tables']['Alumno']['Row'];
type Convenio = Database['public']['Tables']['Convenio']['Row'];

interface EstudiantesProp {
  hijosData: Alumno[];
  convenios: Convenio[];
}

export function Convenios({ hijosData, convenios }: EstudiantesProp) {
  // Filtrar alumnos que tienen convenio
  const alumnosConConvenio = hijosData.filter((hijo) => hijo.convenio);

  return (
    <div>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-gray-800">Convenios por Atraso</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {alumnosConConvenio.length > 0 ? (
            <div className="space-y-6">
              {alumnosConConvenio.map((hijo) => {
                // Buscar el convenio correspondiente al id_alumno
                const convenioAlumno = convenios.find(
                  (convenio) => convenio.id_alumno === hijo.id_alumno
                );

                return (
                  <div
                    key={hijo.id_alumno}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-100">
                          <Image
                            src="/placeholder.svg"
                            alt={`${hijo.nombre} ${hijo.apellido_paterno}`}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">
                          {hijo.nombre} {hijo.apellido_paterno} {hijo.apellido_materno}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hijo.grado} {hijo.grupo}
                        </p>

                        {convenioAlumno ? (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-gray-800">
                              Convenio de pago
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Incremento: {convenioAlumno.porcentaje_incremento}%
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Fecha de inicio: {convenioAlumno.fecha_inicio}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Estado: {convenioAlumno.firmado ? 'Firmado' : 'Pendiente de firma'}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-700">
                              La información del convenio está cargando o no está disponible.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">
                  Información sobre convenios
                </h4>
                <p className="text-sm text-gray-600">
                  Los convenios por atraso son acuerdos especiales que permiten
                  a los padres de familia regularizar sus pagos pendientes con
                  un incremento porcentual aplicado.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Para solicitar un convenio, por favor acuda a la
                  administración del colegio con una identificación oficial.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No hay convenios activos
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Actualmente no tiene convenios por atraso activos. Si necesita
                un convenio especial, por favor contacte a la administración.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
