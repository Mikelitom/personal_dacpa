"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Separator } from '@/app/components/ui/separator';
import { ShoppingCart, CreditCard, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/app/components/ui/use-toast';
import { Toaster } from '@/app/components/ui/toaster';
import Image from 'next/image';
import Link from 'next/link';

// Tipo para los productos en el carrito
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
};

// Estado inicial del carrito para pruebas
export const initialCartState: CartItem[] = [
  {
    id: 1,
    name: 'Paquete de Libros - 1er Grado',
    price: 2500.00,
    quantity: 1,
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Uniforme Deportivo',
    price: 850.00,
    quantity: 1,
    size: '8',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Uniforme de Diario (Niña)',
    price: 950.00,
    quantity: 1,
    size: '6',
    image: '/placeholder.svg'
  }
];

export default function CarritoPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(initialCartState);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Calculamos el total del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id: number, amount: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  // Función para eliminar un producto del carrito
  const removeItem = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Función para procesar el pago
  const handlePayment = () => {
    if (!selectedStudent) {
      toast({
        title: "Selecciona un estudiante",
        description: "Debes seleccionar un estudiante para continuar con el pago",
        variant: "destructive",
      });
      return;
    }

    setIsPaying(true);
    
    // Simulamos el proceso de pago
    setTimeout(() => {
      setIsPaying(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Si el pago fue exitoso, mostramos la pantalla de éxito
  if (isSuccess) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold mt-4">¡Compra Realizada con Éxito!</h1>
            <p className="mt-2">Gracias por tu compra. Hemos enviado los detalles a tu correo electrónico.</p>
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si está procesando el pago, mostramos un indicador de carga
  if (isPaying) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
            <h1 className="text-2xl font-bold mt-4">Procesando Pago</h1>
            <p className="mt-2">Por favor espera mientras procesamos tu pago...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      
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
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Tu carrito está vacío</h3>
                  <p className="mt-1 text-gray-500">¿No sabes qué comprar? Explora nuestros productos</p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/tienda">Ver productos</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={80}
                          height={100}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.size && <p className="text-sm text-gray-500">Talla: {item.size}</p>}
                        <p className="font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={clearCart}>Vaciar carrito</Button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Resumen de compra */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="estudiante">Asignar a estudiante</Label>
                <Select onValueChange={setSelectedStudent} value={selectedStudent}>
                  <SelectTrigger id="estudiante">
                    <SelectValue placeholder="Seleccionar estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est1">Ana Pérez González - 1°A</SelectItem>
                    <SelectItem value="est2">Carlos Pérez González - 3°B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Tabs defaultValue="tarjeta">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="tarjeta">Tarjeta de Crédito</TabsTrigger>
                    <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tarjeta">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Fecha de Expiración</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                      <Input id="cardName" placeholder="Juan Pérez" />
                    </div>
                  </TabsContent>
                  <TabsContent value="transferencia">
                    <div className="bg-blue-50 p-4 rounded-md space-y-2">
                      <p className="font-medium">Datos para Transferencia:</p>
                      <p>Banco: Banco Nacional</p>
                      <p>Cuenta: 0123 4567 8901 2345</p>
                      <p>CLABE: 012 345 6789012345678</p>
                      <p>Beneficiario: Colegio Ejemplo</p>
                      <p>Referencia: {selectedStudent ? `Estudiante #${selectedStudent}` : 'Seleccione estudiante'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comprobante">Subir Comprobante</Label>
                      <Input id="comprobante" type="file" />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={cart.length === 0}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar ${cartTotal.toFixed(2)}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}