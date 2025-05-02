import { useState, useEffect } from "react";
import { getEstudiantes, getHistorialReportes, generarPDF } from "@/app/services/reportes-service";
import { getNombreReporte } from "@/app/lib/utils/reportes";
import { HistorialReporte } from "../../types";

export function useReportes() {
  const [estudiantes, setEstudiantes] = useState<{ id: string | number; nombre: string; grado: string }[]>([]);
  const [estudianteId, setEstudianteId] = useState<string | number>('todos');
  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();
  const [historialReportes, setHistorialReportes] = useState<HistorialReporte[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const [estudiantesData, historialData] = await Promise.all([
          getEstudiantes(),
          getHistorialReportes()
        ]);
        
        setEstudiantes(estudiantesData);
        setHistorialReportes(historialData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, []);

  const handleGenerarPDF = async (tipoReporte: string, accion: 'descargar' | 'imprimir') => {
    if (!fechaInicio || !fechaFin) {
      alert("Selecciona el rango de fechas.");
      return;
    }

    try {
      if (accion === 'imprimir') {
        // Abrir en nueva pestaña e imprimir
        const url = `/api/generar-pdf?tipo=${tipoReporte}&estudianteId=${estudianteId}&fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`;
        const ventanaImpresion = window.open(url, "_blank");
        if (ventanaImpresion) {
          ventanaImpresion.onload = function() {
            setTimeout(() => {
              ventanaImpresion.print();
            }, 1000);
          };
        }
      } else {
        // Descargar automáticamente
        const blob = await generarPDF({
          tipo: tipoReporte,
          estudianteId,
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString()
        });
        
        const link = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        
        // Obtener el nombre descriptivo del reporte
        const nombreReporte = getNombreReporte(tipoReporte);
        
        // Obtener el nombre del estudiante seleccionado
        let nombreEstudiante = "Todos";
        if (estudianteId !== 'todos') {
          const estSeleccionado = estudiantes.find(est => est.id.toString() === estudianteId.toString());
          if (estSeleccionado) {
            nombreEstudiante = estSeleccionado.nombre.replace(/\s+/g, '-');
          }
        }
        
        // Crear nombre de archivo descriptivo
        link.href = href;
        link.download = `${estudianteId || 'todos'}-${nombreEstudiante}-${nombreReporte}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el reporte");
    }
  };

  const handleHistorialReporte = async (reporte: HistorialReporte, accion: 'descargar' | 'imprimir') => {
    try {
      if (accion === 'imprimir') {
        // Abrir en nueva pestaña e imprimir
        const url = `/api/generar-pdf?tipo=${reporte.tipo}&estudianteId=${reporte.estudianteId}&fechaInicio=${reporte.fechaInicio}&fechaFin=${reporte.fechaFin}`;
        const ventanaImpresion = window.open(url, "_blank");
        if (ventanaImpresion) {
          ventanaImpresion.onload = function() {
            setTimeout(() => {
              ventanaImpresion.print();
            }, 1000);
          };
        }
      } else {
        // Descargar automáticamente
        const url = `/api/generar-pdf?tipo=${reporte.tipo}&estudianteId=${reporte.estudianteId}&fechaInicio=${reporte.fechaInicio}&fechaFin=${reporte.fechaFin}`;
        const res = await fetch(url);
        const blob = await res.blob();
        
        const link = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        
        // Obtener el nombre descriptivo del reporte
        const nombreReporte = getNombreReporte(reporte.tipo);
        
        // Crear nombre de archivo descriptivo
        link.href = href;
        link.download = `${reporte.estudianteId}-${reporte.estudianteNombre.replace(/\s+/g, '-')}-${nombreReporte}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
      }
    } catch (error) {
      console.error("Error al descargar el PDF del historial:", error);
      alert("Ocurrió un error al obtener el reporte del historial");
    }
  };

  return {
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
  };
}