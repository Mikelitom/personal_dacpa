"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/app/components/ui/toaster";
import { useUniformes } from "./hooks/useUniformes";
import useCart from "@/app/dashboard/carrito/hooks/useCart";
import { CartItem } from "@/app/dashboard/carrito/hooks/useCart";  // Asegúrate de importar correctamente
import { SearchHeader } from "@/app/components/uniformes/SearchHeader";
import { CategoriaFilter } from "@/app/components/uniformes/CategoriaFilter";
import { UniformeCard } from "@/app/components/uniformes/UniformeCard";
import { EmptyResults } from "@/app/components/uniformes/EmptyResults";

export default function UniformesPage() {
  const { uniformes, loading, error } = useUniformes();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();  // Usar el hook aquí
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");

  // Filtrar uniformes según búsqueda y categoría
  const uniformesFiltrados = useMemo(() => {
    return uniformes.filter((uniforme) => {
      const matchesSearch =
        uniforme.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uniforme.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoriaSeleccionada === "todos" || uniforme.categoria === categoriaSeleccionada;
      return matchesSearch && matchesCategory;
    });
  }, [uniformes, searchTerm, categoriaSeleccionada]);

  const handleAgregarAlCarrito = (idArticulo: number, talla: string, cantidad: number) => {
    // Encontrar el artículo específico en el uniforme agrupado
    const uniformeSeleccionado = uniformes.find(u => 
      Object.values(u.tallas).some(t => t.id_articulo === idArticulo)
    );
    
    if (!uniformeSeleccionado) return;

    // Crear un objeto de artículo para el carrito
    const articulo: CartItem = {
      id_articulo: idArticulo,
      nombre: uniformeSeleccionado.nombre,
      precio_venta: uniformeSeleccionado.precio,
      imagen_url: uniformeSeleccionado.imagen_url,
      cantidad,
    };

    // Agregar al carrito usando la función del hook
    addToCart(articulo);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoriaSeleccionada("todos");
  };

  // Animación para los elementos que aparecen
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando uniformes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 text-center max-w-lg">
          <h3 className="text-xl font-medium text-red-700">Error al cargar los uniformes</h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            onClick={() => window.location.reload()}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <SearchHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        carritoCount={cart.reduce((acc, item) => acc + item.cantidad, 0)}  // Contar artículos en el carrito
      />

      <div className="mb-6">
        <CategoriaFilter 
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
        />
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {uniformesFiltrados.map((uniforme) => {
          return (
            <UniformeCard
              key={uniforme.nombre}
              uniforme={uniforme}
              onAgregarAlCarrito={handleAgregarAlCarrito} enCarrito={false}            
            />
          );
        })}
      </motion.div>

      {uniformesFiltrados.length === 0 && (
        <EmptyResults onReset={resetFilters} />
      )}

      <Toaster />
    </div>
  );
}
