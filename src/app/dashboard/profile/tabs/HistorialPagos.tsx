import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { PagoColegiatura, Alumno } from "../../types";

interface Props {
  alumnos: Alumno[];
  pagos: PagoColegiatura[];
}

export const HistorialPagos: React.FC<Props> = ({ alumnos, pagos }) => {
  // Función para obtener el mes de la fecha de pago
  const obtenerMes = (fecha: string) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat("es-MX", { month: "long" }).format(date);
  };

  return (
    <div>
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-gray-800">Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue={alumnos[0]?.id_alumno.toString()} className="w-full">
            <TabsList className="w-full mb-4">
              {alumnos.map((alumno) => (
                <TabsTrigger
                  key={alumno.id_alumno}
                  value={alumno.id_alumno.toString()}
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-gray-700"
                >
                  {alumno.nombre.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {alumnos.map((alumno) => (
              <TabsContent key={alumno.id_alumno} value={alumno.id_alumno.toString()}>
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
                      {pagos
                        .filter((p) => p.id_alumno === alumno.id_alumno)
                        .map((pago) => (
                          <tr key={pago.id_colegiatura} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {obtenerMes(pago.fecha_pago)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {pago.estado === "Pagado" ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  Pagado
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                  Pendiente
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {pago.fecha_pago}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              ${pago.monto.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {pago.estado === "Pagado" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-pink-600 hover:text-pink-700"
                                >
                                  {/* Recibo */}
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-pink-600 hover:text-pink-700"
                                >
                                  {/* Pagar */}
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
    </div>
  );
};