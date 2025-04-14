"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { BookOpen, CreditCard, FileText, ShoppingBag } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      href: "/dashboard/colegiatura",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      label: "Pagar Colegiatura",
      primary: true,
    },
    {
      href: "/dashboard/productos/libros",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      label: "Ver Libros Escolares",
      primary: false,
    },
    {
      href: "/dashboard/productos/uniformes",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
      label: "Ver Uniformes",
      primary: false,
    },
    {
      href: "/dashboard/reportes",
      icon: <FileText className="mr-2 h-4 w-4" />,
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
          <Link key={action.href} href={action.href}>
            <Button
              className={`w-full justify-start ${
                action.primary
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              variant={action.primary ? "default" : "outline"}
            >
              {action.icon}
              {action.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}