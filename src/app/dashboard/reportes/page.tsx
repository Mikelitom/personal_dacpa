"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { TIPOS_REPORTES } from "@/app/lib/utils/reportes"
import { FiltrosReporte } from "./components/filtros-reporte"
import { TarjetaReporte } from "./components/tarjeta-reporte"
import { TablaHistorial } from "./components/tabla-historial"
import { useReportes } from "./hooks/use-reportes"

export default function ReportesPage() {
  const {
    estudiantes,
    estudianteId,
    setEstudianteId,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    historialReportes,
    cargando,
    handleGenerarPDF,
    handleHistorialReporte
  } = useReportes();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      <Tabs defaultValue="generar">
        <TabsList className="mb-6">
          <TabsTrigger value="generar">Generar Reportes</TabsTrigger>
          <TabsTrigger value="historial">Historial de Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="generar">
          <FiltrosReporte
            estudiantes={estudiantes}
            estudianteId={estudianteId}
            setEstudianteId={setEstudianteId}
            fechaInicio={fechaInicio}
            setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}
            setFechaFin={setFechaFin}
          />

          {cargando ? (
            <div className="text-center py-6">Cargando...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {TIPOS_REPORTES.map((reporte) => (
                <TarjetaReporte
                  key={reporte.id}
                  reporte={reporte}
                  onGenerarPDF={handleGenerarPDF}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historial">
          {cargando ? (
            <div className="text-center py-6">Cargando...</div>
          ) : (
            <TablaHistorial
              historialReportes={historialReportes}
              onHistorialReporte={handleHistorialReporte}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}