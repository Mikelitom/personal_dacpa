// src/components/perfil/tabs/InfoPersonal.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react"
import { Database } from "@/app/lib/types"

type PadreFamilia = Database['public']['Tables']['PadreFamilia']['Row']
type Usuario = Database['public']['Tables']['Usuario']['Row']

interface InfoPersonalProps {
  usuarioData: Usuario;
  padreData: PadreFamilia;
  updateProfile: (nuevoUsuario: Usuario, nuevoPadre: PadreFamilia) => Promise<void>;
}

export function InfoPersonal({ usuarioData, padreData, updateProfile }: InfoPersonalProps) {
  const [editMode, setEditMode] = useState(false)
  const [editUsuario, setEditUsuario] = useState<Usuario>({ ...usuarioData })
  const [editPadre, setEditPadre] = useState<PadreFamilia>({ ...padreData })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para manejar cambios en los campos de usuario
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditUsuario({
      ...editUsuario,
      [name]: value,
    })
  }

  // Función para manejar cambios en los campos de padre
  const handlePadreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditPadre({
      ...editPadre,
      [name]: value,
    })
  }

  // Función para guardar cambios
  const saveChanges = async () => {
    setIsSubmitting(true)
    try {
      await updateProfile(editUsuario, editPadre)
      setEditMode(false)
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditUsuario({ ...usuarioData })
    setEditPadre({ ...padreData })
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
          <EditForm 
            editUsuario={editUsuario} 
            editPadre={editPadre} 
            handleUsuarioChange={handleUsuarioChange} 
            handlePadreChange={handlePadreChange} 
          />
        ) : (
          <InfoDisplay padreData={padreData} usuarioData={usuarioData} />
        )}
      </CardContent>
      {editMode && (
        <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
          <div className="flex gap-2 w-full justify-end">
            <Button onClick={cancelEdit} variant="outline" className="text-gray-700" disabled={isSubmitting}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={saveChanges} 
              className="bg-pink-600 hover:bg-pink-700 text-white"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

interface EditFormProps {
  editUsuario: Usuario;
  editPadre: PadreFamilia;
  handleUsuarioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePadreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EditForm({ editUsuario, editPadre, handleUsuarioChange, handlePadreChange }: EditFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre_completo" className="text-gray-700">
            Nombre completo
          </Label>
          <Input
            id="nombre_completo"
            name="nombre_completo"
            value={editUsuario.nombre_completo}
            onChange={handleUsuarioChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="correo" className="text-gray-700">
            Correo electrónico
          </Label>
          <Input
            id="correo"
            name="correo"
            type="email"
            value={editUsuario.correo}
            onChange={handleUsuarioChange}
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
            value={editUsuario.telefono}
            onChange={handleUsuarioChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="celular" className="text-gray-700">
            Celular
          </Label>
          <Input
            id="celular"
            name="celular"
            value={editPadre.celular}
            onChange={handlePadreChange}
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
            value={editPadre.direccion}
            onChange={handlePadreChange}
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
            value={editPadre.ciudad}
            onChange={handlePadreChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codigo_postal" className="text-gray-700">
            Código Postal
          </Label>
          <Input
            id="codigo_postal"
            name="codigo_postal"
            value={editPadre.codigo_postal}
            onChange={handlePadreChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono_oficina" className="text-gray-700">
            Teléfono Oficina
          </Label>
          <Input
            id="telefono_oficina"
            name="telefono_oficina"
            value={editPadre.telefono_oficina}
            onChange={handlePadreChange}
            className="border-gray-200 text-gray-800"
          />
        </div>
      </div>
    </div>
  )
}

interface InfoDisplayProps {
  padreData: PadreFamilia;
  usuarioData: Usuario;
}

function InfoDisplay({ padreData, usuarioData }: InfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <InfoItem 
          icon={<User className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Nombre completo" 
          value={usuarioData.nombre_completo} 
        />
        <InfoItem 
          icon={<Mail className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Correo electrónico" 
          value={usuarioData.correo} 
        />
        <InfoItem 
          icon={<Phone className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Teléfono" 
          value={usuarioData.telefono} 
        />
        <InfoItem 
          icon={<Phone className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Celular" 
          value={padreData.celular} 
        />
      </div>
      <div className="space-y-4">
        <InfoItem 
          icon={<MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Dirección" 
          value={padreData.direccion} 
        />
        <InfoItem 
          icon={<MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Ciudad" 
          value={padreData.ciudad} 
        />
        <InfoItem 
          icon={<MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Código Postal" 
          value={padreData.codigo_postal} 
        />
        <InfoItem 
          icon={<Phone className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />} 
          label="Teléfono Oficina" 
          value={padreData.telefono_oficina} 
        />
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