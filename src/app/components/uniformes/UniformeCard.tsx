import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { UniformeAgrupado } from "@/app/dashboard/productos/types";
import { StockBadge } from "./StockBadge";
import { CantidadSelector } from "./CantidadSelector";

interface UniformeCardProps {
  uniforme: UniformeAgrupado;
  onAgregarAlCarrito: (idArticulo: number, talla: string, cantidad: number) => void;
  enCarrito: boolean;
}

export function UniformeCard({ uniforme, onAgregarAlCarrito, enCarrito }: UniformeCardProps) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);

  const handleTallaChange = (talla: string) => {
    setTallaSeleccionada(talla);
    setCantidad(1);
  };

  const handleCantidadChange = (_id: string | number, nuevaCantidad: number) => {
    setCantidad(nuevaCantidad);
  };

  const handleAgregarAlCarrito = () => {
    if (!tallaSeleccionada) return;
    
    const detallesTalla = uniforme.tallas[tallaSeleccionada];
    onAgregarAlCarrito(detallesTalla.id_articulo, tallaSeleccionada, cantidad);
  };

  const hayStock = tallaSeleccionada ? uniforme.tallas[tallaSeleccionada].stock > 0 : false;
  const sinStock = tallaSeleccionada ? uniforme.tallas[tallaSeleccionada].stock === 0 : false;

  // Categorías en español para mostrar
  const categoriaLabel = {
    'diario': 'Uniforme Diario',
    'deportivo': 'Deportivo',
    'gala': 'Gala'
  }[uniforme.categoria] || 'Otro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-md overflow-hidden h-full">
        <CardHeader className="pb-2 bg-gradient-to-r from-pink-50 to-white border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold">{uniforme.nombre}</CardTitle>
              <CardDescription>{uniforme.descripcion}</CardDescription>
            </div>
            <div>{tallaSeleccionada && <StockBadge stock={uniforme.tallas[tallaSeleccionada].stock} />}</div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-64 w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg p-4">
              {/* <Image
                src={uniforme.imagen_url || "/placeholder.svg"}
                alt={uniforme.nombre}
                width={250}
                height={300}
                className="object-contain max-h-full"
              /> */}
              <Badge className="absolute top-2 right-2 bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200">
                {categoriaLabel}
              </Badge>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <p className="text-2xl font-bold text-pink-600">${uniforme.precio.toFixed(2)}</p>

              <div className="space-y-2">
                <Label htmlFor={`talla-${uniforme.nombre}`}>Talla</Label>
                <Select
                  value={tallaSeleccionada}
                  onValueChange={handleTallaChange}
                >
                  <SelectTrigger id={`talla-${uniforme.nombre}`} className="bg-white">
                    <SelectValue placeholder="Seleccionar talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(uniforme.tallas).map(([talla, detalles]) => (
                      <SelectItem key={talla} value={talla}>
                        {talla} {detalles.stock === 0 ? " - Sin existencias" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {tallaSeleccionada && sinStock && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-amber-700 text-sm">
                        Esta talla no está disponible actualmente. Por favor, consulta más tarde.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tallaSeleccionada && (
                <CantidadSelector 
                  id={uniforme.nombre} 
                  cantidad={cantidad} 
                  setCantidad={handleCantidadChange} 
                />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-4">
          <div className="w-full flex justify-end gap-2">
            {tallaSeleccionada && (
              <>
                <Button
                  onClick={handleAgregarAlCarrito}
                  disabled={enCarrito || sinStock}
                  className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300"
                >
                  {enCarrito ? (
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
                {enCarrito && (
                  <Link href="/dashboard/carrito">
                    <Button variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                      Ver carrito
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}