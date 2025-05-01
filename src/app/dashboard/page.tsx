"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"
import { WelcomeBanner } from "@/app/dashboard/components/WelcomeBanner"
import { QuickActions } from "@/app/dashboard/components/QuickActions"
import { ActiveConvenios } from "@/app/dashboard/components/ActiveConvenios"
import { UpcomingPayments } from "@/app/dashboard/components/UpcomingPayments"
import { PaymentCalendar } from "@/app/dashboard/components/PaymentCalendar"
import { StudentSummary } from "@/app/dashboard/components/StudentSummary"
import { supabase } from "../lib/supabase"
import { useUsuario } from "./hooks/use-usuario"
import { useAlumnos } from "./hooks/use-alumnos"
import { useConvenios } from "./hooks/use-convenios"
import { usePagosColegiatura } from "./hooks/use-pagos"
import type { Alumno, Usuario, PagoColegiatura } from "./types"

export default function DashboardPage() {
  // Estados
  const { 
    usuario, 
    loading: loadingUsuario 
  } = useUsuario();

  const { 
    alumnos, 
    loading: loadingAlumnos 
  } = useAlumnos(loadingUsuario ? undefined : usuario?.id_padre);

  const {
    convenios,
    loading: loadingConvenios
  } = useConvenios(loadingUsuario ? undefined : usuario?.id_padre);

  const listaId = useMemo(() => {
    if (loadingUsuario) return undefined;
    return alumnos.map(a => a.id_alumno);
  }, [loadingUsuario, alumnos]);

  const {
    data: pagosColegiatura,
    loading: loadingPagosColegiatura
  } = usePagosColegiatura(loadingUsuario ? undefined : listaId) 

  const { toast } = useToast()
  const [ error, setError ] = useState<string | null>(null)
  const [ pagos, setPagos ] = useState<Record<string, PagoColegiatura>>({})
  const [ session, setSession ] = useState<any>(null)
  
  const loading = loadingUsuario || loadingAlumnos || loadingConvenios;
  
  // Un solo useEffect para obtener la sesión
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser()
      setSession(data?.user)
    }

    getSession()
  }, [])

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
        <div className="space-y-6">
          <QuickActions />
          <ActiveConvenios alumnos={alumnos} convenios={convenios} />
        </div>

        <div className="space-y-6">
          <UpcomingPayments alumnos={alumnos} convenios={convenios} pagosColegiatura={pagosColegiatura} />
        </div>

        <div className="space-y-6">
          <PaymentCalendar payments={pagosColegiatura} />
          <StudentSummary students={alumnos} />
        </div>
      </div>
    </div>
  )
}