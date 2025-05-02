import { Alumno, PagoColegiatura } from "@/app/dashboard/types"

export async function getEstudiantes() {
  // Aquí implementarías la lógica para obtener los estudiantes desde tu API
  try {
    const response = await fetch('/api/alumnos');
    const data = await response.json();
    
    // Transformar los datos al formato que necesitamos
    return data.map((alumno: Alumno) => ({
      id: alumno.id_alumno,
      nombre: `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`,
      grado: `${alumno.grado}${alumno.grupo}`
    }));
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    return [];
  }
}

export async function getHistorialReportes() {
  // Aquí implementarías la lógica para obtener el historial de reportes
  try {
    const response = await fetch('/api/historial-reportes');
    return await response.json();
  } catch (error) {
    console.error("Error al obtener historial de reportes:", error);
    return [];
  }
}

export async function generarPDF(params: {
  tipo: string;
  estudianteId: string | number;
  fechaInicio: string;
  fechaFin: string;
}) {
  const url = `/api/generar-pdf?tipo=${params.tipo}&estudianteId=${params.estudianteId}&fechaInicio=${params.fechaInicio}&fechaFin=${params.fechaFin}`;
  
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Error al generar el PDF');
      }
      return res.blob();
    });
}