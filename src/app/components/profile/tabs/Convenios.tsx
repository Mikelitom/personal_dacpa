import React from "react";
import { StudentData } from "@/app/types/profile";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/card";
import Image from "next/image";
import { Clock } from "lucide-react";

interface EstudiantesProp {
  hijosData: StudentData[];
}

export function Convenios({ hijosData }: EstudiantesProp) {
  return (
    <div>
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
                  <div
                    key={hijo.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                  >
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
                        <h3 className="font-bold text-gray-800">
                          {hijo.nombre}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hijo.grado}
                          {hijo.grupo}
                        </p>

                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-gray-800">
                            {hijo.convenio?.tipo}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Descuento: {hijo.convenio?.descuento}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Vigencia: {hijo.convenio?.vigencia}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">
                  Información sobre convenios
                </h4>
                <p className="text-sm text-gray-600">
                  Los convenios por atraso son acuerdos especiales que permiten
                  a los padres de familia regularizar sus pagos pendientes con
                  un descuento aplicado.
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
