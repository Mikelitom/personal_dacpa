import { useState } from 'react';
import { UniformeEnCarrito } from '@/app/dashboard/productos/types';
import { useToast } from "@/app/components/ui/use-toast";

export const useCarrito = () => {
  const { toast } = useToast();
  const [carrito, setCarrito] = useState<UniformeEnCarrito[]>([]);

  const agregarAlCarrito = (articulo: any, talla: string, cantidad: number) => {
    // Verificar si ya existe en el carrito
    const existeEnCarrito = carrito.some(
      item => item.articulo.id_articulo === articulo.id_articulo
    );

    if (existeEnCarrito) {
      toast({
        title: "Artículo ya en el carrito",
        description: "Este artículo ya se encuentra en tu carrito",
        variant: "destructive",
      });
      return;
    }

    const nuevoItem: UniformeEnCarrito = {
      articulo,
      talla,
      cantidad
    };

    setCarrito([...carrito, nuevoItem]);
    
    toast({
      title: "Producto agregado al carrito",
      description: `${articulo.nombre} (Talla: ${talla}, Cantidad: ${cantidad}) ha sido agregado al carrito.`,
      duration: 3000,
    });
  };

  const eliminarDelCarrito = (idArticulo: number) => {
    setCarrito(carrito.filter(item => item.articulo.id_articulo !== idArticulo));
  };

  const actualizarCantidad = (idArticulo: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) return;
    
    setCarrito(
      carrito.map(item => 
        item.articulo.id_articulo === idArticulo 
          ? { ...item, cantidad: nuevaCantidad } 
          : item
      )
    );
  };

  return {
    carrito,
    cantidadTotal: carrito.length,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad
  };
};