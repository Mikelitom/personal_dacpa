"use client"; // Indica que este componente se ejecuta en el lado del cliente
import { Bell, UserCircle } from "lucide-react"; // Importa íconos de lucide-react

// Define la interfaz para las propiedades del componente Navbar
interface NavbarProps {
  title: string; // Título que se mostrará en la barra de navegación
  user: string; // Nombre del usuario que se mostrará en la barra de navegación
}

// Componente funcional Navbar
export default function Navbar({ title, user }: NavbarProps) {
  return ( 
    <nav className="flex items-center justify-between bg-white p-4 shadow-md"> {/* Contenedor de la barra de navegación */}
      {/* Título o logo */}
      <h1 className="text-xl font-bold">{title}</h1> {/* Muestra el título de la barra de navegación */}

      {/* Iconos y perfil */}
      <div className="flex items-center gap-4"> {/* Contenedor para los iconos y el perfil */}
        {/* Notificaciones */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full"> {/* Botón para notificaciones */}
          <Bell className="w-6 h-6" /> {/* Icono de campana para notificaciones */}
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3 {/* Número de notificaciones */}
          </span>
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"> {/* Contenedor para el perfil */}
          <UserCircle className="w-8 h-8" /> {/* Icono de usuario */}
          <span className="font-medium">{user}</span> {/* Muestra el nombre del usuario */}
        </div>
      </div>
    </nav>
  );
}