// /app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from "react"
import { ProfileLayout } from "@/app/dashboard/profile/ProfileLayout"
import { supabase } from "@/app/lib/supabase"
import { User } from "@supabase/supabase-js"
import { useUsuario } from "../hooks/use-usuario"
import { Usuario, Alumno, PadreFamilia } from '../types'
import { useProfilePage } from "../hooks/use-profile-page"

export default function PerfilPage() {
  const [ activeTab, setActiveTab ] = useState('info')

  const {
    usuario,
    padre, 
    alumnos,
    convenios,
    pagos, 
    loading
  } = useProfilePage();

  if (loading) {
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
        usuario={usuario} 
        padre={padre}
        alumnos={alumnos}
        convenios={convenios}
        pagos={pagos}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  )
}