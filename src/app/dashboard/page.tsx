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
  // Estados
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [pagos, setPagos] = useState<Record<string, PagoColegiatura>>({})
  const [session, setSession] = useState<any>(null)
  
  // Un solo useEffect para obtener la sesión
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser()
      setSession(data?.user)
    }

    getSession()
  }, [])

  // Función para obtener pagos por ID de alumno
  const fetchPagosById = async (idAlumno: number) => {
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
  }

  // Cargar todos los datos necesarios
  useEffect(() => {
    // Control para evitar múltiples cargas
    const loadData = async () => {
      if (!session?.email) return
      
      try {
        console.log("[DEBUG] Cargando datos con email:", session?.email)
        setLoading(true)

        // 1. Obtener usuario
        const email = session.email.toString()
        const usuarioResponse = await fetch(`/api/usuario/${email}/usuario`)

        if (!usuarioResponse.ok) {
          const errorData = await usuarioResponse.json()
          throw new Error(errorData.error || "Failed to fetch usuario")
        }

        const usuarioData = await usuarioResponse.json()
        console.log("[DEBUG] Datos de usuario recibidos:", usuarioData)
        setUsuario(usuarioData)

        // 2. Si hay id_padre, obtener alumnos
        if (usuarioData.id_padre) {
          const alumnosResponse = await fetch(`/api/alumnos/${usuarioData.id_padre}/by_id`)

          if (!alumnosResponse.ok) {
            const errorData = await alumnosResponse.json()
            throw new Error(errorData.error || "Failed to fetch alumnos")
          }

          const alumnosData = await alumnosResponse.json()
          console.log("[DEBUG] Datos de alumnos recibidos:", alumnosData)
          setAlumnos(alumnosData)

          // 3. Cargar pagos para todos los alumnos
          if (alumnosData.length > 0) {
            console.log("[DEBUG] Cargando pagos para", alumnosData.length, "alumnos")
            const newPagos: Record<string, PagoColegiatura> = {}

            for (const alumno of alumnosData) {
              const pago = await fetchPagosById(alumno.id_alumno)
              if (pago) {
                newPagos[alumno.id_alumno] = pago
              }
            }

            setPagos(newPagos)
          }
        }
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
    }

    loadData()
  }, [session, toast]) // Solo dependemos de session y toast

  // Skeleton loader cuando está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-2">Cargando...</p>
        <p className="text-xs text-gray-400">
          {session ? `Sesión activa: ${session.email}` : "No hay sesión activa"}
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
          {session ? `Sesión activa: ${session.email}` : "No hay sesión activa"}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            // Reintentar la carga de datos
            setLoading(true)
            // La carga se realizará automáticamente por el useEffect
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
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <PaymentCalendar payments={Object.values(pagos)} />
          <StudentSummary students={alumnos} />
        </div>
      </div>
    </div>
  )
}