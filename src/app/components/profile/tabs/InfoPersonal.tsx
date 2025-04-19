// src/components/perfil/tabs/InfoPersonal.tsx
"use client"

import { useState, Dispatch, SetStateAction } from "react"
import { TutelaryData } from "@/app/types/profile"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react"

interface InfoPersonalProps {
  padreData: TutelaryData;
  setPadreData: Dispatch<SetStateAction<TutelaryData>>;
}

export function InfoPersonal({ padreData, setPadreData }: InfoPersonalProps) {
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<TutelaryData>({ ...padreData })

  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData({
      ...editData,
      [name]: value,
    })
  }

  // Función para guardar cambios
  const saveChanges = () => {
    setPadreData(editData)
    setEditMode(false)
  }

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditData({ ...padreData })
    setEditMode(false)
  }

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-800">Información Personal</CardTitle>
          {!editMode && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="text-gray-700">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {editMode ? (
          <EditForm editData={editData} handleChange={handleChange} />
        ) : (
          <InfoDisplay padreData={padreData} />
        )}
      </CardContent>
      {editMode && (
        <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
          <div className="flex gap-2 w-full justify-end">
            <Button onClick={cancelEdit} variant="outline" className="text-gray-700">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={saveChanges} className="bg-pink-600 hover:bg-pink-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Guardar cambios
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

interface EditFormProps {
  editData: TutelaryData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EditForm({ editData, handleChange }: EditFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-gray-700">
            Nombre completo
          </Label>
          <Input
            id="nombre"
            name="nombre"
            value={editData.nombre}
            onChange={handleChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Correo electrónico
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={editData.email}
            onChange={handleChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-gray-700">
            Teléfono
          </Label>
          <Input
            id="telefono"
            name="telefono"
            value={editData.telefono}
            onChange={handleChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion" className="text-gray-700">
            Dirección
          </Label>
          <Input
            id="direccion"
            name="direccion"
            value={editData.direccion}
            onChange={handleChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ciudad" className="text-gray-700">
            Ciudad
          </Label>
          <Input
            id="ciudad"
            name="ciudad"
            value={editData.ciudad}
            onChange={handleChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codigoPostal" className="text-gray-700">
            Código Postal
          </Label>
          <Input
            id="codigoPostal"
            name="codigoPostal"
            value={editData.codigoPostal}
            onChange={handleChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
      </div>
    </div>
  )
}

function InfoDisplay({ padreData }: { padreData: TutelaryData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <InfoItem icon={<User className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} label="Nombre completo" value={padreData.nombre} />
        <InfoItem icon={<Mail className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} label="Correo electrónico" value={padreData.email} />
        <InfoItem icon={<Phone className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} label="Teléfono" value={padreData.telefono} />
      </div>
      <div className="space-y-4">
        <InfoItem icon={<MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} label="Dirección" value={padreData.direccion} />
        <InfoItem icon={<MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} label="Ciudad" value={padreData.ciudad} />
        <InfoItem icon={<MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} label="Código Postal" value={padreData.codigoPostal} />
      </div>
    </div>
  )
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}