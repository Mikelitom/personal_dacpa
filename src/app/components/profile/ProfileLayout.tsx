// src/components/perfil/PerfilLayout.tsx
"use client"

import { Dispatch, SetStateAction } from "react"
import { TutelaryData, StudentData } from "@/app/types/profile"
import { SidePanel } from "./SidePanel"
import { InfoPersonal } from "./tabs/InfoPersonal"
import { Estudiantes } from "./tabs/Estudiantes"
import { HistorialPagos } from './tabs/HistorialPagos'
import { Convenios } from "./tabs/Convenios"
import { Documentos } from "./tabs/Documentos"

interface PerfilLayoutProps {
  tutelaryData: TutelaryData;
  setTutelaryData: Dispatch<SetStateAction<TutelaryData>>;
  studentsData: StudentData[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export function ProfileLayout({ 
  tutelaryData, 
  setTutelaryData, 
  studentsData, 
  activeTab, 
  setActiveTab 
}: PerfilLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Panel izquierdo - Información del padre */}
      <div className="lg:col-span-1">
        <SidePanel 
          nombre={tutelaryData.nombre} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {/* Panel derecho - Contenido según la pestaña seleccionada */}
      <div className="lg:col-span-3">
        {activeTab === "info" && (
          <InfoPersonal 
            padreData={tutelaryData} 
            setPadreData={setTutelaryData} 
          />
        )}

        {activeTab === "estudiantes" && (
          <Estudiantes hijosData={studentsData} />
        )}

        {activeTab === "pagos" && (
          <HistorialPagos hijosData={studentsData} />
        )}

        {activeTab === "convenios" && (
          <Convenios hijosData={studentsData} />
        )}

        {activeTab === "documentos" && (
          <Documentos />
        )}
      </div>
    </div>
  )
}