// src/components/perfil/ProfileLayout.tsx
"use client"

import { Dispatch, SetStateAction } from "react"
import { InfoPersonal } from "./tabs/InfoPersonal"
import { Estudiantes } from "./tabs/Estudiantes"
import { HistorialPagos } from './tabs/HistorialPagos'
import { Convenios } from "./tabs/Convenios"
import { Database } from "@/app/lib/types"
import { SidePanel } from "./SidePanel"
import { PadreFamilia, Usuario, Alumno, Convenio, PagoColegiatura } from "../types"

interface ProfileLayoutProps {
  usuario: Usuario;
  padre: PadreFamilia;
  alumnos: Alumno[];
  convenios: Convenio[];
  pagos: PagoColegiatura[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export function ProfileLayout({ 
  usuario,
  padre, 
  alumnos, 
  convenios,
  pagos,
  activeTab, 
  setActiveTab 
}: ProfileLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Panel izquierdo - Información del padre */}
      <div className="lg:col-span-1">
        <SidePanel 
          nombre={padre.nombre || usuario.nombre_completo} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {/* Panel derecho - Contenido según la pestaña seleccionada */}
      <div className="lg:col-span-3">
        {activeTab === "info" && (
          <InfoPersonal 
            usuario={usuario} 
            padre={padre} 
          />
        )}

        {activeTab === "estudiantes" && (
          <Estudiantes hijosData={alumnos} />
        )}

        {activeTab === "pagos" && (
          <HistorialPagos hijosData={alumnos} pagos={pagos}/>
        )}

        {activeTab === "convenios" && (
          <Convenios hijosData={alumnos} convenios={convenios}/>
        )}
      </div>
    </div>
  )
}