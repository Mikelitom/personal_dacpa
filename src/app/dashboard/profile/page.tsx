'use client'

import { useState } from "react"
import { ProfileLayout } from "@/app/components/profile/ProfileLayout"
import { TutelaryData, StudentData } from "@/app/types/profile"
import { sampleData } from "@/app/data/sampleData"

export default function PerfilPage() {
  const [tutelaryData, setTutelaryData] = useState<TutelaryData>(sampleData.tutelary)
  const [studentsData, setStudentsData] = useState<StudentData[]>(sampleData.students)
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Perfil Familiar</h1>
      <ProfileLayout 
        tutelaryData={tutelaryData} 
        setTutelaryData={setTutelaryData}
        studentsData={studentsData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  )
}