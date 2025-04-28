"use client"

import { useState, useEffect } from "react"
import type { MesColegiatura, Convenio, EstudianteUI } from "../types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/app/lib/types"

export function useColegiaturaData() {
  const [estudiantes, setEstudiantes] = useState<EstudianteUI[]>([])
  const [mesesColegiatura, setMesesColegiatura] = useState<MesColegiatura[]>([])
  const [convenios, setConvenios] = useState<Convenio[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch alumnos desde Supabase
        const { data: alumnos, error: alumnosError } = await supabase.from("Alumno").select("*")

        if (alumnosError) throw alumnosError

        // Fetch historial de pagos
        const { data: historialPagos, error: historialError } = await supabase.from("HistorialPago").select("*")

        if (historialError) throw historialError

        // Fetch convenios
        const { data: conveniosData, error: conveniosError } = await supabase.from("Convenio").select("*")

        if (conveniosError) throw conveniosError

        // Si prefieres seguir usando datos de ejemplo para desarrollo, comenta las líneas anteriores
        // y descomenta las siguientes:

        /*
        // Datos de ejemplo para desarrollo
        const alumnos: Estudiante[] = [
          {
            id_alumno: 1,
            id_padre: 1,
            nombre: "Ana",
            apellido_paterno: "Pérez",
            apellido_materno: "González",
            fecha_nacimiento: "2015-05-10",
            grado: "1°A",
            grupo: "A",
            ciclo_escolar: "2023-2024",
            fecha_inscripción: "2023-08-15",
            estado: "activo",
            convenio: true,
          },
          {
            id_alumno: 2,
            id_padre: 1,
            nombre: "Carlos",
            apellido_paterno: "Pérez",
            apellido_materno: "González",
            fecha_nacimiento: "2013-03-22",
            grado: "3°B",
            grupo: "B",
            ciclo_escolar: "2023-2024",
            fecha_inscripción: "2023-08-15",
            estado: "activo",
            convenio: false,
          },
        ]
        */

        // Crear versión UI de estudiantes
        const uiEstudiantes: EstudianteUI[] = alumnos.map((est) => ({
          id: est.id_alumno.toString(),
          nombre: `${est.nombre} ${est.apellido_paterno} ${est.apellido_materno}`,
          grado: est.grado,
          monto: "1500.00",
          tieneConvenio: est.convenio,
          descuento: est.convenio ? "10%" : undefined,
        }))

        setEstudiantes(uiEstudiantes)

        // Generar meses de colegiatura basados en los estudiantes y el historial de pagos
        const mesesGenerados: MesColegiatura[] = []

        const mesesNombres = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ]

        // Aquí puedes usar historialPagos para generar los meses con datos reales
        // Por ahora, generamos datos de ejemplo
        uiEstudiantes.forEach((est) => {
          mesesNombres.forEach((mes, index) => {
            const esPagado = index < 4 // Los primeros 4 meses están pagados
            const mesId = `${mes.toLowerCase().substring(0, 3)}${est.id === "1" ? "" : est.id}`

            mesesGenerados.push({
              id: mesId,
              nombre: mes,
              monto: 1500,
              estado: esPagado ? "pagado" : "pendiente",
              fechaPago: esPagado ? `${index + 8}/0${index + 1}/2024` : undefined,
              vencimiento: !esPagado ? `10/${index < 7 ? "0" : ""}${index + 1}/2024` : undefined,
              incluye: mes === "Enero" ? "Libros" : undefined,
              estudiante: est.id,
              nombreEstudiante: est.nombre,
              interes: mes === "Marzo" ? 150 : undefined,
            })
          })
        })

        setMesesColegiatura(mesesGenerados)

        // Procesar datos de convenios
        const conveniosUI = conveniosData.map((convenio) => {
          // Buscar el alumno correspondiente
          const alumno = alumnos.find((a) => a.id_alumno === convenio.id_alumno)
          const nombreCompleto = alumno
            ? `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
            : "Estudiante"

          return {
            ...convenio,
            estudiante: nombreCompleto,
            tipo: "Convenio por atraso",
            descripcion: `Descuento del ${convenio.porcentaje_incremento}% en colegiaturas pendientes por pago anticipado`,
            fechaFin: new Date(
              new Date(convenio.fecha_inicio).getTime() + 30 * 24 * 60 * 60 * 1000,
            ).toLocaleDateString(),
          }
        })

        setConvenios(conveniosUI)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  return {
    estudiantes,
    mesesColegiatura,
    convenios,
    isLoading,
  }
}
