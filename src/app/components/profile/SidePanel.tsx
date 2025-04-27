// src/components/perfil/SidePanel.tsx
"use client"

import { Dispatch, SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import {
  User,
  GraduationCap,
  CreditCard,
  Clock,
  FileText,
} from "lucide-react"

interface SidePanelProps {
  nombre: string;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export function SidePanel({ nombre, activeTab, setActiveTab }: SidePanelProps) {
  return (
    <Card className="border-gray-200 shadow-md h-full">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500">
              {nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        </div>
        <CardTitle className="text-center text-gray-800">{nombre}</CardTitle>
        <p className="text-center text-gray-500 text-sm">Padre/Tutor</p>
      </CardHeader>

      <CardContent className="p-4">
        <nav className="space-y-1">
          <NavButton 
            icon={<User className="mr-2 h-4 w-4" />}
            label="Información Personal"
            tabId="info"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavButton 
            icon={<GraduationCap className="mr-2 h-4 w-4" />}
            label="Estudiantes"
            tabId="estudiantes"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavButton 
            icon={<CreditCard className="mr-2 h-4 w-4" />}
            label="Historial de Pagos"
            tabId="pagos"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavButton 
            icon={<Clock className="mr-2 h-4 w-4" />}
            label="Convenios"
            tabId="convenios"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>
      </CardContent>
    </Card>
  )
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  tabId: string;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

function NavButton({ icon, label, tabId, activeTab, setActiveTab }: NavButtonProps) {
  return (
    <Button
      variant={activeTab === tabId ? "default" : "ghost"}
      className={`w-full justify-start ${activeTab === tabId ? "bg-pink-600 hover:bg-pink-700 hover:shadow-md hover:shadow-pink-200 text-white group-hover:translate-x-1" : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm group-hover:translate-x-1"}`}
      onClick={() => setActiveTab(tabId)}
    >
      {icon}
      {label}
    </Button>
  )
}