import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { FileText } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

export function Documentos() {
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-gray-800">Documentos</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">
              Documentos Disponibles
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-pink-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Reglamento Escolar
                    </p>
                    <p className="text-xs text-gray-500">PDF - 2.3 MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-600 hover:text-pink-700"
                >
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
                    <p className="font-medium text-gray-800">
                      Calendario Escolar 2023-2024
                    </p>
                    <p className="text-xs text-gray-500">PDF - 1.5 MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-600 hover:text-pink-700"
                >
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
                    <p className="font-medium text-gray-800">
                      Lista de Útiles Escolares
                    </p>
                    <p className="text-xs text-gray-500">PDF - 0.8 MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-600 hover:text-pink-700"
                >
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
            <h3 className="font-bold text-gray-800 mb-4">
              Documentos Requeridos
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-amber-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Comprobante de Domicilio
                    </p>
                    <p className="text-xs text-gray-500">
                      Pendiente de entrega
                    </p>
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
                    <p className="font-medium text-gray-800">
                      Acta de Nacimiento
                    </p>
                    <p className="text-xs text-gray-500">
                      Entregado el 15/01/2024
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Entregado
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
