"use client";
import { useState, ElementType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Settings, LogOut, Menu, UserPen, CircleDollarSign, 
  BookOpenCheck, ShoppingCart, ChevronDown, ChevronUp, 
  Book, Shirt, Store
} from "lucide-react";

interface MenuItem {
  href?: string;
  icon: ElementType;
  text: string;
  subItems?: MenuItem[];
}

const studentsMenu: MenuItem[] = [
  { href: "/dashboard", icon: Home, text: "Inicio" },
  { href: "/colegiatura", icon: CircleDollarSign, text: "Colegiatura" },
  { 
    icon: Store, text: "Productos", subItems: [
      { href: "/books", icon: Book, text: "Libros" },
      { href: "/uniforms", icon: Shirt, text: "Uniforme" }
    ] 
  },
  { href: "/cart", icon: ShoppingCart, text: "Carrito" },
  { href: "/status", icon: BookOpenCheck, text: "Estado de Cuenta" },
  { href: "/profile", icon: UserPen, text: "Perfil" },
  { href: "/dashboard/settings", icon: Settings, text: "Configuración" }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const menu = studentsMenu;

  return (
    <aside className={`h-screen bg-pink-200 text-black p-4 transition-all ${isOpen ? "w-64" : "w-20"}`}>

      <button className="mb-6 flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6" />
        {isOpen && <span className="text-lg font-bold">Menú</span>}
      </button>

      <nav className="space-y-4">
        {menu.map((item, index) =>
          item.subItems ? (
            <SidebarDropdown key={index} {...item} isOpen={isOpen} />
          ) : (
            <SidebarItem key={index} href={item.href!} icon={item.icon} text={item.text} isOpen={isOpen} />
          )
        )}
        <div className="absolute bottom-4 p-3">
          <SidebarItem href="/" icon={LogOut} text="Salir" isOpen={isOpen} />
        </div>
      </nav>

    </aside>
  );
}

function SidebarItem({ href, icon: Icon, text, isOpen }: { href: string; icon: React.ElementType; text: string; isOpen: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 p-3 rounded-md transition-all 
        ${isActive ? "bg-pink-400 text-white" : "hover:bg-pink-300"}`}
    >
      <Icon className="w-6 h-6" />
      {isOpen && <span>{text}</span>}
    </Link>
  );
}

function SidebarDropdown({ icon: Icon, text, isOpen, subItems = [] }: { icon: React.ElementType; text: string; isOpen: boolean; subItems?: MenuItem[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const isActive = subItems.some((sub) => sub.href === pathname);

  return (
    <div>
      <div 
        className={`flex items-center justify-between gap-4 p-3 rounded-md cursor-pointer 
          ${isActive ? "bg-pink-400 text-white" : "hover:bg-pink-300"}`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <Icon className="w-6 h-6" />
          {isOpen && <span>{text}</span>}
        </div>
        {isOpen && (isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />)}
      </div>
      {isExpanded && (
        <div className="ml-6 mt-2 space-y-2">
          {subItems.map((subItem, index) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Link 
                key={index} 
                href={subItem.href!} 
                className={`flex items-center gap-4 p-2 rounded-md transition-all 
                  ${isSubActive ? "bg-pink-400 text-white" : "hover:bg-pink-300"}`}
              >
                <subItem.icon className="w-5 h-5" />
                {isOpen && <span>{subItem.text}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
