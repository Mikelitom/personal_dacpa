"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { ShoppingCart, Check, BookOpen, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/app/components/ui/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { motion } from "framer-motion";
import { Articulo } from "../types";
import useCart from "@/app/dashboard/carrito/hooks/useCart";
import Image from "next/image";

export default function PaquetesPage() {
  const { toast } = useToast();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [carritoCount, setCarritoCount] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("");
  const [paquetes, setPaquetes] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenesPaquetes, setImagenesPaquetes] = useState<Record<string, string>>({});

  // Datos estáticos para los contenidos de los paquetes
  const paquetesContenido = {
    "1": [
      { id: 1, nombre: "Learning Easy Words Preschool 1", descripcion: "Vocabulario básico en inglés para preescolar" },
      { id: 2, nombre: "Grafomania 1", descripcion: "Desarrollo de habilidades de escritura" },
      { id: 3, nombre: "La fiesta de los números 1", descripcion: "Introducción a matemáticas básicas" },
    ],
    "2": [
      { id: 1, nombre: "Learning Easy Words Preschool 2", descripcion: "Vocabulario intermedio en inglés para preescolar" },
      { id: 2, nombre: "Grafomania 2", descripcion: "Escritura avanzada para pequeños" },
      { id: 3, nombre: "La fiesta de los números 2", descripcion: "Matemáticas para segundo nivel" },
    ],
    "3": [
      { id: 1, nombre: "Learning Easy Words Preschool 3", descripcion: "Vocabulario avanzado en inglés para preescolar" },
      { id: 2, nombre: "Grafomania 3", descripcion: "Perfeccionamiento de escritura" },
      { id: 3, nombre: "La fiesta de los números 3", descripcion: "Matemáticas avanzadas para preescolar" },
    ],
  };

  // Mapeo de imágenes por ID de paquete con URLs reales de Imgur
  const obtenerImagenesPaquetes = async () => {
    try {
      // URLs directas de las imágenes de Imgur
      const imagenes = {
        "1": "https://i.imgur.com/15yLm6h.jpg", // Paquete 1
        "2": "https://i.imgur.com/BSSpnd3.jpg", // Paquete 2
        "3": "https://i.imgur.com/Fu2i97x.jpg", // Paquete 3
      };
      
      setImagenesPaquetes(imagenes);
    } catch (error) {
      console.error("Error al cargar las imágenes:", error);
    }
  };

  useEffect(() => {
    const fetchPaquetes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/articulos/Libros");
        const data: Articulo[] = await res.json();

        setPaquetes(data);
        if (data.length > 0) {
          setActiveTab(data[0].id_articulo.toString());
        }
        
        // Obtener las imágenes de los paquetes
        await obtenerImagenesPaquetes();
      } catch (error) {
        console.error("Error al cargar los paquetes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, []);

  useEffect(() => {
    setCarritoCount(cart.reduce((acc, item) => acc + item.cantidad, 0));
  }, [cart]);

  const agregarAlCarrito = (paquete: Articulo) => {
    addToCart(paquete);
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

  // Componente para renderizar la imagen del paquete
  const PaqueteImagen = ({ idPaquete }: { idPaquete: string }) => {
    const imagenUrl = imagenesPaquetes[idPaquete];
    
    if (!imagenUrl) {
      return (
        <div className="w-full h-full min-h-56 bg-gray-100 rounded-lg flex items-center justify-center p-4 border border-dashed border-gray-300">
          <div className="flex flex-col items-center text-gray-400">
            <div className="h-24 w-24 mb-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="h-12 w-12 text-gray-300" />
            </div>
            <p className="text-sm text-center">Imagen no disponible</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
        <Image 
          src={imagenUrl}
          alt={`Imagen del paquete ${idPaquete}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          onError={(e) => {
            // Fallback si la imagen no carga
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.style.display = 'none';
            target.parentElement!.classList.add('bg-gray-100', 'flex', 'items-center', 'justify-center');
            const fallback = document.createElement('div');
            fallback.innerHTML = `
              <div class="flex flex-col items-center text-gray-400">
                <div class="h-24 w-24 mb-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <span class="text-3xl text-gray-300">📚</span>
                </div>
                <p class="text-sm text-center">Imagen no disponible</p>
              </div>
            `;
            target.parentElement!.appendChild(fallback);
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg">Cargando paquetes...</p>
        </div>
      </div>
    );
  }

  if (paquetes.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg">No hay paquetes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 inset-0 flex-1 overflow-auto bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 w-full bg-white shadow-lg rounded-lg p-6 border-l-4 border-pink-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
              <BookOpen className="h-8 w-8 mr-3 text-pink-600" />
              Paquetes Escolares
            </h1>
            <p className="text-gray-600 text-lg">
              Compra paquetes completos para el ciclo escolar 2024-2025. Todos nuestros paquetes incluyen los libros esenciales para el mejor desarrollo educativo.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              
            </div>
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
            const paqueteId = paquete.id_articulo.toString();
            const contenidoPaquete = paquetesContenido[paqueteId as keyof typeof paquetesContenido] || [];

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
                      <div className="flex flex-col lg:flex-row gap-6 w-full">
                        {/* Imagen del paquete */}
                        <div className="w-full lg:w-1/3">
                          <PaqueteImagen idPaquete={paqueteId} />
                          
                          {/* Información de imagen */}
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 text-center">Imagen ilustrativa del paquete {paquete.nombre}</p>
                          </div>
                        </div>
                        
                        {/* Información del paquete */}
                        <div className="w-full lg:w-2/3">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                              <h3 className="text-lg font-semibold">Precio del paquete:</h3>
                              <p className="text-3xl font-bold text-pink-600">${paquete.precio_venta.toFixed(2)}</p>
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
                          
                          <h3 className="text-lg font-semibold mb-3 text-gray-800">Contenido del paquete:</h3>
                          <div className="grid md:grid-cols-3 gap-3">
                            {contenidoPaquete.map((libro) => (
                              <Card key={libro.id} className="border border-gray-200 shadow-sm bg-white">
                                <CardHeader className="py-3 px-4">
                                  <CardTitle className="text-sm font-medium text-pink-700">{libro.nombre}</CardTitle>
                                </CardHeader>
                                <CardContent className="py-2 px-4">
                                  <p className="text-xs text-gray-600">{libro.descripcion}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t w-full">
                      <p className="text-sm text-gray-500">* Incluye todos los libros requeridos para el nivel educativo correspondiente.</p>
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