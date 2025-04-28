"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";
import {
  ShoppingCart,
  CreditCard,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { useToast } from "@/app/components/ui/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import useCart from "@/app/dashboard/carrito/hooks/useCart"; // Importamos nuestro hook personalizado

export default function CarritoPage() {
  const { toast } = useToast();
  const { cart, addToCart, removeFromCart, clearCart, updateQuantity } =
    useCart(); // Usamos nuestro hook personalizado
  const [metodo, setMetodo] = useState("tarjeta");
  const [estudiante, setEstudiante] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Simulamos el tiempo de carga
  useEffect(() => {
    setTimeout(() => {
      setCargando(false);
    }, 500);
  }, []);

  // Datos de ejemplo para estudiantes
  const estudiantes = [
    { id: "est1", nombre: "Ana Pérez González", grado: "1°A" },
    { id: "est2", nombre: "Carlos Pérez González", grado: "3°B" },
  ];

  // Calculamos el total del carrito
  const calcularTotal = () => {
    return cart.reduce(
      (total, item) => total + item.precio_venta * item.cantidad,
      0
    );
  };

  const handlePagar = () => {
    if (!estudiante) {
      toast({
        title: "Selecciona un estudiante",
        description:
          "Por favor selecciona un estudiante para continuar con el pago",
        variant: "destructive",
      });
      return;
    }

    setProcesando(true);
    // Simulación de proceso de pago
    setTimeout(() => {
      setProcesando(false);
      setCompletado(true);
      clearCart(); // Vaciamos el carrito después de un pago exitoso
    }, 2000);
  };

  if (cargando) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (completado) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-center">
              ¡Compra Realizada con Éxito!
            </h2>
            <p className="text-center mt-2">
              Tu pedido ha sido procesado correctamente. Recibirás una
              confirmación por correo electrónico.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
              <Link href="/dashboard/estado-cuenta">
                <Button>Ver mis compras</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-center">
              Tu carrito está vacío
            </h2>
            <p className="text-center mt-2 text-gray-500">
              No tienes productos en tu carrito de compras.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/dashboard/productos/libros">
                <Button variant="outline">Ver libros</Button>
              </Link>
              <Link href="/dashboard/productos/uniformes">
                <Button>Ver uniformes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({cart.length})</CardTitle>
                <CardDescription>
                  Revisa los productos en tu carrito antes de continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id_articulo}
                      className="flex items-center space-x-4 py-2 border-b last:border-0"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0">
                        {/* <Image
                          src={item.imagen_url || "/placeholder.svg"}
                          alt={item.nombre}
                          width={80}
                          height={100}
                          className="object-contain"
                        /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{item.nombre}</h3>
                        <p className="font-bold">
                          ${item.precio_venta.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id_articulo, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id_articulo, item.cantidad + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id_articulo)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Vaciar carrito
                </Button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-2xl font-bold">
                    ${calcularTotal().toFixed(2)}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Resumen y pago */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estudiante">Asignar a estudiante</Label>
                  <Select value={estudiante} onValueChange={setEstudiante}>
                    <SelectTrigger id="estudiante">
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {estudiantes.map((est) => (
                        <SelectItem key={est.id} value={est.id}>
                          {est.nombre} - {est.grado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Proceder a pago</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handlePagar}
                  disabled={procesando}
                >
                  {procesando ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagar ${calcularTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
