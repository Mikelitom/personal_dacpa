// src/components/perfil/ProfileLayout.tsx
"use client"

import { Dispatch, SetStateAction } from "react"
import { SidePanel } from "./SidePanel"
import { InfoPersonal } from "./tabs/InfoPersonal"
import { Estudiantes } from "./tabs/Estudiantes"
import { HistorialPagos } from './tabs/HistorialPagos'
import { Convenios } from "./tabs/Convenios"
import { Documentos } from "./tabs/Documentos"
import { Database } from "@/app/lib/types"

type PadreFamilia = Database['public']['Tables']['PadreFamilia']['Row']
type Usuario = Database['public']['Tables']['Usuario']['Row']
type Alumno = Database['public']['Tables']['Alumno']['Row']

interface ProfileLayoutProps {
  usuarioData: Usuario;
  padreData: PadreFamilia;
  updateProfile: (nuevoUsuario: Usuario, nuevoPadre: PadreFamilia) => Promise<void>;
  alumnosData: Alumno[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export function ProfileLayout({ 
  usuarioData,
  padreData, 
  updateProfile, 
  alumnosData, 
  activeTab, 
  setActiveTab 
}: ProfileLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Panel izquierdo - Información del padre */}
      <div className="lg:col-span-1">
        <SidePanel 
          nombre={padreData.nombre || usuarioData.nombre_completo} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {/* Panel derecho - Contenido según la pestaña seleccionada */}
      <div className="lg:col-span-3">
        {activeTab === "info" && (
          <InfoPersonal 
            usuarioData={usuarioData} 
            padreData={padreData} 
            updateProfile={updateProfile} 
          />
        )}

        {activeTab === "estudiantes" && (
          <Estudiantes hijosData={alumnosData} />
        )}

        {activeTab === "pagos" && (
          <HistorialPagos hijosData={alumnosData} />
        )}

        {activeTab === "convenios" && (
          <Convenios hijosData={alumnosData} />
        )}

        {activeTab === "documentos" && (
          <Documentos />
        )}
      </div>
    </div>
  )
}