// /app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from "react"
import { ProfileLayout } from "@/app/components/profile/ProfileLayout"
import { Database } from "@/app/lib/types"
import { supabase } from "@/app/lib/supabase"
import { User } from "@supabase/supabase-js"

type PadreFamilia = Database['public']['Tables']['PadreFamilia']['Row']
type Usuario = Database['public']['Tables']['Usuario']['Row']
type Alumno = Database['public']['Tables']['Alumno']['Row']

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [padre, setPadre] = useState<PadreFamilia | null>(null)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const [session, setSession] = useState<User | null>(null)

  useEffect(() => {
    console.log('[Debug] Inicio fetch de usuario')
    const getSession = async () => {
      const { data } = await supabase.auth.getUser()
      console.log(data)
      setSession(data?.user)
      console.log('[Debug] Sesion obtenida: ', session)
    }

    getSession()
  }, [])

  useEffect(() => {
    console.log('[Debug] Sesion actualizada: ', session)
  }, [session])

  useEffect(() => {
    const fetchData = async () => {
      
      if (!session?.email) return;
      try {
        
        // Obtener datos del usuario actual
        const email = session.email.toString()
        const userResponse = await fetch(`/api/usuario/${email}/usuario`)
        const userData = await userResponse.json()
        setUsuario(userData)
        console.log('[Debug] User actualizada: ', userData)
        
        // Obtener datos del padre usando el id_padre del usuario
        const padreResponse = await fetch(`/api/padre-familia/${userData.id_padre}`)
        const padreData = await padreResponse.json()
        setPadre(padreData)

        // Obtener datos de los alumnos relacionados
        const alumnosResponse = await fetch(`/api/alumnos/${userData.id_padre}/by_id`)
        const alumnosData = await alumnosResponse.json()
        setAlumnos(alumnosData)

        setIsLoading(false)
      } catch (error) {
        console.error("Error cargando los datos:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session])

  const updateProfile = async (nuevoUsuario: Usuario, nuevoPadre: PadreFamilia) => {
    try {
      // Actualizar datos del usuario
      await fetch(`/api/user/${nuevoUsuario.id_usuario}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
      })

      // Actualizar datos del padre
      await fetch(`/api/padres/${nuevoPadre.id_padre}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoPadre)
      })

      // Actualizar estado local
      setUsuario(nuevoUsuario)
      setPadre(nuevoPadre)
    } catch (error) {
      console.error("Error actualizando el perfil:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <p className="text-gray-600">Cargando información del perfil...</p>
      </div>
    )
  }

  if (!usuario || !padre) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-red-500">Error cargando la información. Por favor, intente de nuevo.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Perfil Familiar</h1>
      <ProfileLayout 
        usuarioData={usuario} 
        padreData={padre}
        updateProfile={updateProfile}
        alumnosData={alumnos}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  )
}