"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/app/components/ui/toaster";
import { useUniformes } from "./hooks/useUniformes";
import useCart from "@/app/dashboard/carrito/hooks/useCart";
import { CartItem } from "@/app/dashboard/carrito/hooks/useCart";
import { Search, ShoppingCart, SearchX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/app/components/ui/use-toast";

// Datos de uniformes con imágenes de Imgur
const uniformesImagenes = {
  "uniforme de invierno niño": "https://i.imgur.com/iIcRwtM.jpg",
  "uniforme de invierno niña": "https://i.imgur.com/iIcRwtM.jpg",
  "uniforme invierno niño": "https://i.imgur.com/iIcRwtM.jpg",
  "uniforme invierno niña": "https://i.imgur.com/iIcRwtM.jpg",
  "invierno niño": "https://i.imgur.com/iIcRwtM.jpg",
  "invierno niña": "https://i.imgur.com/iIcRwtM.jpg",
  "uniforme diario niña": "https://i.imgur.com/KcCWPEl.jpg",
  "uniforme diario niño": "https://i.imgur.com/UwUFyAX.jpg",
  "uniforme gala niña": "https://i.imgur.com/phI90rk.jpg",
  "uniforme gala niño": "https://i.imgur.com/KiSVziK.jpg",
  "uniforme deportivo": "https://i.imgur.com/BKVLcHw.jpg",
};

// Mapeo de categorías para el filtro
const categoriasMap = {
  "diario": ["uniforme diario niña", "uniforme diario niño"],
  "invierno": ["invierno", "uniforme invierno", "uniforme de invierno"],
  "gala": ["uniforme gala niña", "uniforme gala niño", "gala"],
  "deportivo": ["uniforme deportivo", "deportivo"]
};

// Componente de Filtro de Categoría
function CategoriaFilter({ categoriaSeleccionada, onCategoriaChange }) {
  const categorias = [
    { id: "todos", nombre: "Todos" },
    { id: "diario", nombre: "Diario" },
    { id: "gala", nombre: "Gala" },
    { id: "deportivo", nombre: "Deportivo" },
    { id: "invierno", nombre: "Invierno" },
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Categorías</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {categorias.map((categoria) => (
          <motion.button
            key={categoria.id}
            className={`px-6 py-2.5 rounded-full transition-all shadow-sm ${
              categoriaSeleccionada === categoria.id
                ? "bg-pink-600 text-white font-medium"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-pink-50"
            }`}
            onClick={() => onCategoriaChange(categoria.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {categoria.nombre}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Componente de Tarjeta de Uniforme
function UniformeCard({ uniforme, onAgregarAlCarrito, enCarrito }) {
  const [cantidad, setCantidad] = useState(1);

  // Obtener la primera talla disponible
  const primeraOpcion = Object.values(uniforme.tallas)[0];
  
  const handleAgregar = () => {
    if (!primeraOpcion) {
      toast({
        title: "Error",
        description: "No hay tallas disponibles para este uniforme",
        variant: "destructive",
      });
      return;
    }

    onAgregarAlCarrito(primeraOpcion.id_articulo, primeraOpcion.talla, cantidad);

    toast({
      title: "¡Agregado al carrito!",
      description: `${cantidad} ${uniforme.nombre} agregado al carrito`,
    });
  };

  // Verificar si hay stock
  const hayStock = Object.values(uniforme.tallas).some(
    (talla) => talla.stock > 0
  );

  // Animación para la tarjeta
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-shadow hover:shadow-lg"
      variants={cardVariants}
    >
      {/* Imagen */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        {uniforme.imagen_url ? (
          <div className="h-full w-full relative">
            <Image
              src={uniforme.imagen_url}
              alt={uniforme.nombre}
              layout="fill"
              objectFit="cover"
              className="transition-transform hover:scale-105 duration-300"
              unoptimized // Para usar URLs externas como Imgur
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-gray-400">Sin imagen disponible</span>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{uniforme.nombre}</h3>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-pink-600 font-semibold text-xl">
            ${uniforme.precio.toFixed(2)}
          </p>
          
          {hayStock ? (
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              En stock
            </span>
          ) : (
            <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
              Sin stock
            </span>
          )}
        </div>

        {/* Selector de cantidad */}
        <div className="flex items-center mb-4">
          <span className="text-gray-700 mr-3">Cantidad:</span>
          <div className="flex border border-gray-300 rounded-md">
            <button
              type="button"
              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-l-md"
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="w-12 text-center border-none outline-none"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button
              type="button"
              className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-r-md"
              onClick={() => setCantidad(cantidad + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Botón de agregar al carrito */}
        <motion.button
          onClick={handleAgregar}
          disabled={!hayStock || enCarrito}
          className={`w-full py-2 rounded-md font-medium transition ${
            !hayStock || enCarrito
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-pink-600 text-white hover:bg-pink-700"
          }`}
          whileHover={hayStock && !enCarrito ? { scale: 1.02 } : {}}
          whileTap={hayStock && !enCarrito ? { scale: 0.98 } : {}}
        >
          {enCarrito
            ? "Ya en carrito"
            : !hayStock
            ? "Sin disponibilidad"
            : "Agregar al carrito"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Componente de Cabecera con Búsqueda
function SearchHeader({ searchTerm, onSearchChange, carritoCount }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <motion.h1 
        className="text-3xl font-bold text-center mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Uniformes Escolares
      </motion.h1>
      
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
            placeholder="Buscar uniformes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Link href="/dashboard/carrito" passHref>
          <motion.div 
            className="relative p-2 bg-pink-600 text-white rounded-full cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart size={24} />
            {carritoCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-pink-600">
                {carritoCount}
              </span>
            )}
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

// Componente para Resultados Vacíos
function EmptyResults({ onReset }) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
        <div className="mb-6 text-gray-400 flex justify-center">
          <SearchX size={60} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No se encontraron uniformes
        </h3>
        
        <p className="text-gray-600 mb-6">
          No hay uniformes que coincidan con tu búsqueda. Intenta con otros términos o restablece los filtros.
        </p>
        
        <motion.button
          onClick={onReset}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Restablecer filtros
        </motion.button>
      </div>
    </motion.div>
  );
}

// Componente Principal
export default function UniformesPage() {
  const { uniformes: uniformesOriginal, loading, error } = useUniformes();
  const { cart, addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");

  // Procesar uniformes para agregar las imágenes correctas y mejorar categorización
  const uniformes = useMemo(() => {
    return uniformesOriginal.map(uniforme => {
      const nombreLower = uniforme.nombre.toLowerCase();
      
      // Asignar categoría si no existe
      let categoria = uniforme.categoria || "";
      
      // Determinar categoría basada en el nombre si no está especificada
      if (!categoria) {
        if (nombreLower.includes("invierno")) {
          categoria = "invierno";
        } else if (nombreLower.includes("diario")) {
          categoria = "diario";
        } else if (nombreLower.includes("gala")) {
          categoria = "gala";
        } else if (nombreLower.includes("deportivo")) {
          categoria = "deportivo";
        }
      }
      
      // Buscar la imagen correspondiente
      let imagenUrl = null;
      for (const key of Object.keys(uniformesImagenes)) {
        if (nombreLower.includes(key)) {
          imagenUrl = uniformesImagenes[key];
          break;
        }
      }
      
      // Caso especial para invierno
      if (!imagenUrl && (nombreLower.includes("invierno") || categoria === "invierno")) {
        if (nombreLower.includes("niña")) {
          imagenUrl = uniformesImagenes["invierno niña"];
        } else {
          imagenUrl = uniformesImagenes["invierno niño"];
        }
      }
      
      return {
        ...uniforme,
        categoria: categoria,
        imagen_url: imagenUrl || uniforme.imagen_url
      };
    });
  }, [uniformesOriginal]);

  // Filtrar uniformes según búsqueda y categoría
  const uniformesFiltrados = useMemo(() => {
    return uniformes.filter((uniforme) => {
      const nombreLower = uniforme.nombre.toLowerCase();
      const descripcionLower = uniforme.descripcion ? uniforme.descripcion.toLowerCase() : '';
      
      // Filtro por término de búsqueda
      const matchesSearch =
        nombreLower.includes(searchTerm.toLowerCase()) ||
        descripcionLower.includes(searchTerm.toLowerCase());
      
      // Filtro por categoría
      let matchesCategory = true;
      if (categoriaSeleccionada !== "todos") {
        matchesCategory = false;
        const categoriaUniformes = categoriasMap[categoriaSeleccionada] || [];
        
        // Revisar en el nombre y descripción del uniforme
        for (const categoriaUniforme of categoriaUniformes) {
          if (nombreLower.includes(categoriaUniforme.toLowerCase()) || 
              descripcionLower.includes(categoriaUniforme.toLowerCase())) {
            matchesCategory = true;
            break;
          }
        }
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [uniformes, searchTerm, categoriaSeleccionada]);

  const handleAgregarAlCarrito = (idArticulo, talla, cantidad) => {
    const uniformeSeleccionado = uniformes.find(u => 
      Object.values(u.tallas).some(t => t.id_articulo === idArticulo)
    );
    
    if (!uniformeSeleccionado) return;

    const articulo = {
      id_articulo: idArticulo,
      nombre: uniformeSeleccionado.nombre,
      precio_venta: uniformeSeleccionado.precio,
      imagen_url: uniformeSeleccionado.imagen_url,
      cantidad,
    };

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
      <div className="p-6 flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando uniformes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white p-8 rounded-lg shadow-md border border-red-200 text-center max-w-lg">
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
    <div className="p-6 bg-white min-h-screen max-w-7xl mx-auto">
      <SearchHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        carritoCount={cart.reduce((acc, item) => acc + item.cantidad, 0)}
      />

      <div className="mb-8 mt-6">
        <CategoriaFilter 
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
        />
      </div>
      
      {/* Información de depuración - Solo durante desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Categoría actual: {categoriaSeleccionada}</p>
          <p className="text-sm text-gray-500">Uniformes encontrados: {uniformesFiltrados.length}</p>
        </div>
      )}

      {uniformesFiltrados.length === 0 ? (
        <EmptyResults onReset={resetFilters} />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {uniformesFiltrados.map((uniforme) => (
            <UniformeCard
              key={uniforme.nombre}
              uniforme={uniforme}
              onAgregarAlCarrito={handleAgregarAlCarrito}
              enCarrito={false}            
            />
          ))}
        </motion.div>
      )}

      <Toaster />
    </div>
  );
}