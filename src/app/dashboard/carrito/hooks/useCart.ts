"use client"

import { useEffect, useState } from "react"
import type { ArticuloConCantidad } from "@/app/dashboard/types"

export type CartItem = ArticuloConCantidad & {
  cantidad: number
}

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
      setInitialized(true) // ✅ Ya cargamos del localStorage
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && initialized) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, initialized])

  const addToCart = (item: ArticuloConCantidad) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id_articulo === item.id_articulo)
      if (found) {
        return prev.map((i) => (i.id_articulo === item.id_articulo ? { ...i, cantidad: i.cantidad + 1 } : i))
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
  }

  const updateQuantity = (id_articulo: number, newQuantity: number) => {
    // No permitir cantidades menores a 1
    if (newQuantity < 1) return

    setCart((prev) =>
      prev.map((item) => (item.id_articulo === id_articulo ? { ...item, cantidad: newQuantity } : item)),
    )
  }

  const removeFromCart = (id_articulo: number) => {
    setCart((prev) => prev.filter((item) => item.id_articulo !== id_articulo))
  }

  const clearCart = () => {
    setCart([])
  }

  return { cart, addToCart, removeFromCart, clearCart, updateQuantity }
}
