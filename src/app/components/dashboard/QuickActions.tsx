"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { BookOpen, CreditCard, FileText, ShoppingBag } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      href: "/dashboard/colegiatura",
      icon: <CreditCard className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />,
      label: "Pagar Colegiatura",
      primary: true,
    },
    {
      href: "/dashboard/productos/libros",
      icon: <BookOpen className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />,
      label: "Ver Libros Escolares",
      primary: false,
    },
    {
      href: "/dashboard/productos/uniformes",
      icon: <ShoppingBag className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />,
      label: "Ver Uniformes",
      primary: false,
    },
    {
      href: "/dashboard/reportes",
      icon: <FileText className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />,
      label: "Generar Reportes",
      primary: false,
    },
  ];

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800">
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="group">
            <Button
              className={`w-full justify-start transition-all duration-200 ease-in-out ${
                action.primary
                  ? "bg-pink-600 hover:bg-pink-700 hover:shadow-md hover:shadow-pink-200 text-white group-hover:translate-x-1"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm group-hover:translate-x-1"
              }`}
              variant={action.primary ? "default" : "outline"}
            >
              {action.icon}
              <span className="transition-all duration-200 group-hover:font-medium">
                {action.label}
              </span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}