'use client';

import { useEffect, useState } from 'react';

// Usa el tipo correcto de Articulo
type Articulo = {
  id_articulo: number;
  nombre: string;
  precio_venta: number;
  imagen_url: string;
};

export type CartItem = {
  id_articulo: number;
  nombre: string;
  precio_venta: number;
  imagen_url: string;
  cantidad: number;
};

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Solo ejecutar en el cliente para evitar errores de hidratación
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente para evitar errores de hidratación
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: Articulo) => {
    setCart(prev => {
      const found = prev.find(i => i.id_articulo === item.id_articulo);
      if (found) {
        return prev.map(i =>
          i.id_articulo === item.id_articulo ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const updateQuantity = (id_articulo: number, newQuantity: number) => {
    // No permitir cantidades menores a 1
    if (newQuantity < 1) return;
    
    setCart(prev => 
      prev.map(item => 
        item.id_articulo === id_articulo 
        ? { ...item, cantidad: newQuantity } 
        : item
      )
    );
  };

  const removeFromCart = (id_articulo: number) => {
    setCart(prev => prev.filter(item => item.id_articulo !== id_articulo));
  };

  const clearCart = () => {
    setCart([]);
  };

  return { cart, addToCart, removeFromCart, clearCart, updateQuantity };
}