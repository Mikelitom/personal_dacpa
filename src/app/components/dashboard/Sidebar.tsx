"use client";

import { JSX, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/lib/utils";
import {
  Home,
  User,
  DollarSign,
  ShoppingBag,
  BookOpen,
  ShoppingCart,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onCloseMobileMenu?: () => void;
}

interface NavItem {
  href: string;
  icon: JSX.Element;
  label: string;
  badge?: number;
  subMenu?: NavItem[];
}

export function Sidebar({ className, onCloseMobileMenu }: SidebarProps) {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [notificationsCount, setNotificationsCount] = useState(4);
  const [carritoCount, setCarritoCount] = useState(3);

  // Definición dinámica de los ítems de navegación
  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      icon: <Home size={20} strokeWidth={1.5} />,
      label: "Inicio",
    },
    {
      href: "/dashboard/profile",
      icon: <User size={20} strokeWidth={1.5} />,
      label: "Perfil",
    },
    {
      href: "/dashboard/colegiatura",
      icon: <DollarSign size={20} strokeWidth={1.5} />,
      label: "Colegiatura",
    },
    {
      href: "/dashboard/productos",
      icon: <ShoppingBag size={20} strokeWidth={1.5} />,
      label: "Productos",
      subMenu: [
        {
          href: "/dashboard/productos/books",
          icon: <BookOpen size={18} strokeWidth={1.5} />,
          label: "Libros",
        },
        {
          href: "/dashboard/productos/uniforms",
          icon: <ShoppingBag size={18} strokeWidth={1.5} />,
          label: "Uniformes",
        },
      ],
    },
    {
      href: "/dashboard/carrito",
      icon: <ShoppingCart size={20} strokeWidth={1.5} />,
      label: "Carrito",
      badge: carritoCount,
    },
    {
      href: "/dashboard/reportes",
      icon: <FileText size={20} strokeWidth={1.5} />,
      label: "Reportes",
    },
  ];

  // Mantener abiertos los submenús según la ruta actual
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.subMenu) {
        const shouldOpen = pathname.includes(item.href);
        if (shouldOpen) {
          setOpenSubMenus((prev) => ({
            ...prev,
            [item.href]: true,
          }));
        }
      }
    });
  }, [pathname]);

  // Función para manejar la apertura/cierre de submenús
  const toggleSubMenu = (href: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  // Renderizado de un item de navegación
  const renderNavItem = (item: NavItem, isSubMenuItem = false) => {
    // Verificar si el ítem tiene submenú
    if (item.subMenu) {
      return (
        <li key={item.href}>
          <button
            onClick={() => toggleSubMenu(item.href)}
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 hover:text-[#E94D97] transition-colors",
              (pathname.includes(item.href) || openSubMenus[item.href]) &&
                "text-[#E94D97] font-medium"
            )}
          >
            <div className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                openSubMenus[item.href] && "transform rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {openSubMenus[item.href] && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pl-10 space-y-1 mt-1 overflow-hidden"
              >
                {item.subMenu.map((subItem) => renderNavItem(subItem, true))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      );
    }

    // Renderizado para items regulares
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-between px-4 py-3 hover:text-[#E94D97] transition-colors",
            isSubMenuItem && "py-2",
            pathname === item.href && "text-[#E94D97] font-medium"
          )}
          onClick={onCloseMobileMenu}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </div>
          {item.badge && item.badge > 0 && (
            <div className="bg-[#E94D97] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {item.badge}
            </div>
          )}
        </Link>
      </li>
    );
  };

  return (
    <div
      className={cn(
        "w-64 fixed top-0 left-0 h-screen flex flex-col border-r border-gray-200 bg-white shadow-md z-50",
        className
      )}
    >
      {/* Header con Logo */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-200">
        <div className="w-24 h-24 relative mb-2 bg-gray-50 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=96&width=96"
            alt="Colegio Logo"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-[#E94D97] font-heading">
          Colegio
        </h2>
        <p className="text-xs italic text-center text-gray-600">
          Despertar Al Conocimiento
        </p>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </ul>
      </nav>

      {/* Footer con información del usuario */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Juan Pérez</p>
            <p className="text-xs text-gray-500">Padre/Tutor</p>
          </div>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-500" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E94D97] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </div>
        </div>
        <Link href="/login" className="block w-full">
          <Button
            variant="outline"
            className="w-full mt-4 flex items-center justify-center border-gray-200 text-gray-800 hover:bg-gray-50"
          >
            <LogOut className="mr-2" size={16} />
            <span>Cerrar Sesión</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
