"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"
import { WelcomeBanner } from "@/app/components/dashboard/WelcomeBanner"
import { QuickActions } from "@/app/components/dashboard/QuickActions"
import { ActiveConvenios } from "@/app/components/dashboard/ActiveConvenios"
import { UpcomingPayments } from "@/app/components/dashboard/UpcomingPayments"
import { PaymentCalendar } from "@/app/components/dashboard/PaymentCalendar"
import { StudentSummary } from "@/app/components/dashboard/StudentSummary"
import type { Database } from "../lib/types"
import { supabase } from "../lib/supabase"

type Usuario = Database["public"]["Tables"]["Usuario"]["Row"]
type Alumno = Database["public"]["Tables"]["Alumno"]["Row"]
type PagoColegiatura = Database["public"]["Tables"]["PagoColegiatura"]["Row"]

export default function DashboardPage() {
  // Refs para controlar si ya se han cargado los datos
  const dataFetchedRef = useRef(false)

  // Estados
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const session = supabase.auth.getUser();
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [pagos, setPagos] = useState<Record<string, PagoColegiatura>>({})

  // Memoizamos la función fetchPagosById para evitar recreaciones
  const fetchPagosById = useCallback(async (idAlumno: number) => {
    try {
      const response = await fetch(`/api/pago-colegiatura/${idAlumno}/`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch pagos")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching pagos: ", error)
      return null
    }
  }, [])

  // Memoizamos loadPagos para evitar recreaciones
  const loadPagos = useCallback(
    async (studentList: Alumno[]) => {
      if (!studentList.length) return

      console.log("[DEBUG] Cargando pagos para", studentList.length, "alumnos")
      const newPagos: Record<string, PagoColegiatura> = {}

      for (const alumno of studentList) {
        const pago = await fetchPagosById(alumno.id_alumno)
        if (pago) {
          newPagos[alumno.id_alumno] = pago
        }
      }

      setPagos(newPagos)
    },
    [fetchPagosById],
  )

  // Función principal para cargar datos
  const loadData = useCallback(async () => {
    if (!(await session).data.user?.email || dataFetchedRef.current) return

    try {
      console.log("[DEBUG] Cargando datos con email:", (await session).data.user?.email)

      const email = (await session).data.user.email.toString()
      const usuarioResponse = await fetch(`/api/usuario/${email}/usuario`)

      if (!usuarioResponse.ok) {
        const errorData = await usuarioResponse.json()
        throw new Error(errorData.error || "Failed to fetch usuario")
      }

      const usuarioData = await usuarioResponse.json()
      console.log("[DEBUG] Datos de usuario recibidos:", usuarioData)
      setUsuario(usuarioData)

      if (usuarioData.id_padre) {
        const alumnosResponse = await fetch(`/api/alumnos/${usuarioData.id_padre}/by_id`)

        if (!alumnosResponse.ok) {
          const errorData = await alumnosResponse.json()
          throw new Error(errorData.error || "Failed to fetch alumnos")
        }

        const alumnosData = await alumnosResponse.json()
        console.log("[DEBUG] Datos de alumnos recibidos:", alumnosData)
        setAlumnos(alumnosData)

        // Cargamos pagos después de tener alumnos
        await loadPagos(alumnosData)
      }

      // Marcamos que los datos ya se cargaron
      dataFetchedRef.current = true
    } catch (error: any) {
      console.error("[ERROR] Error al cargar datos:", error)
      setError(error.message)
      toast({
        title: "Error al cargar datos",
        description: "No pudimos cargar los datos del usuario. Por favor, inténtelo más tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [session, toast, loadPagos])

  // Un solo useEffect para iniciar la carga de datos
  useEffect(() => {
    // Si no hay sesión, no cargamos nada
    if (!session) {
      setLoading(false)
      return
    }

    // Si ya tenemos datos cargados, no hacemos nada
    if (dataFetchedRef.current) {
      return
    }

    // Iniciamos la carga de datos
    loadData()

    // Cleanup function
    return () => {
      // No necesitamos hacer nada aquí
    }
  }, [])

  // Skeleton loader cuando está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">Cargando...</p>
        <p className="text-xs text-gray-400">
          {session ? `Sesión activa: ${session.user?.email}` : "No hay sesión activa"}
        </p>
        {error && <p className="text-xs text-red-500 mt-2">Error: {error}</p>}
      </div>
    )
  }

  // Si no hay usuario después de cargar, mostramos un mensaje
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">No se encontró información de usuario</p>
        <p className="text-xs text-gray-400">
          {session ? `Sesión activa: ${session.user?.email}` : "No hay sesión activa"}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            dataFetchedRef.current = false
            setLoading(true)
            loadData()
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <>
        <WelcomeBanner user={usuario} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <QuickActions />
            <ActiveConvenios students={alumnos} />
          </div>

          {/* Columna central */}
          <div className="space-y-6">
            <UpcomingPayments students={alumnos} />
            {/* <Notifications notifications={userData.notifications} /> */}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <PaymentCalendar payments={Object.values(pagos)} />
            <StudentSummary students={alumnos} />
          </div>
        </div>
      </>
    </div>
  )
}
