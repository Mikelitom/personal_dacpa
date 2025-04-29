"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { ShoppingCart, Check, BookOpen } from "lucide-react";
import { useToast } from "@/app/components/ui/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { motion } from "framer-motion";
import { Articulo } from "../types";
import useCart from "@/app/dashboard/carrito/hooks/useCart"; // Importa el hook de carrito

export default function PaquetesPage() {
  const { toast } = useToast();
  const { cart, addToCart, removeFromCart, clearCart } = useCart(); // Usa el hook aquí
  const [carritoCount, setCarritoCount] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("");
  const [paquetes, setPaquetes] = useState<Articulo[]>([]);

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const res = await fetch("/api/articulos/Libros");
        const data: Articulo[] = await res.json();

        setPaquetes(data);
        if (data.length > 0) {
          // Establece el primer paquete como activo por defecto
          setActiveTab(data[0].id_articulo.toString());
        }
      } catch (error) {
        console.error("Error al cargar los paquetes:", error);
      }
    };

    fetchPaquetes();
  }, []);

  useEffect(() => {
    // Actualizar el contador de artículos en el carrito
    setCarritoCount(cart.reduce((acc, item) => acc + item.cantidad, 0));
  }, [cart]);

  const agregarAlCarrito = (paquete: Articulo) => {
    addToCart(paquete); // Usa la función addToCart del hook
    toast({
      title: "Paquete agregado al carrito",
      description: `El paquete "${paquete.nombre}" ha sido agregado al carrito.`,
      duration: 3000,
    });
  };

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Sin existencias</Badge>;
    } else if (stock <= 3) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          Pocas existencias
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          En existencia
        </Badge>
      );
    }
  };

  if (paquetes.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 inset-0 flex-1 overflow-auto bg-gray-50  min-h-screen">
      <div className="container mx-auto p-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-pink-500" />
              Paquetes Escolares
            </h1>
            <p className="text-gray-500 mt-1">Compra paquetes completos para el ciclo escolar 2024-2025</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex items-center w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver carrito
              {carritoCount > 0 && (
                <Badge variant="default" className="ml-2 bg-pink-500">
                  {carritoCount}
                </Badge>
              )}
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white border border-gray-200 p-1 shadow-sm overflow-x-auto flex w-full">
            {paquetes.map((paquete) => (
              <TabsTrigger key={paquete.id_articulo} value={paquete.id_articulo.toString()} className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:shadow-none flex-1">
                {paquete.nombre}
              </TabsTrigger>
            ))}
          </TabsList>

          {paquetes.map((paquete) => {
            const sinStock = paquete.stock_actual === 0;

            return (
              <TabsContent key={paquete.id_articulo} value={paquete.id_articulo.toString()} className="w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="w-full">
                  <Card className="border-none shadow-md overflow-hidden mb-6 w-full">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                        <div>
                          <CardTitle className="text-xl font-bold flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-pink-500" />
                            {paquete.nombre}
                          </CardTitle>
                          <CardDescription>{paquete.descripcion}</CardDescription>
                        </div>
                        <div className="mt-2 md:mt-0">{renderStockBadge(paquete.stock_actual)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                        <div>
                          <h3 className="text-lg font-semibold">Precio del paquete:</h3>
                          <p className="text-2xl font-bold text-pink-600">${paquete.precio_venta.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => agregarAlCarrito(paquete)}
                            disabled={cart.some(item => item.id_articulo === paquete.id_articulo) || sinStock}
                            className="w-full sm:min-w-[180px] bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300"
                          >
                            {cart.some(item => item.id_articulo === paquete.id_articulo) ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Agregado
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Agregar al carrito
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t w-full">
                      <p className="text-sm text-gray-500">* Incluye todos los libros requeridos.</p>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
}
