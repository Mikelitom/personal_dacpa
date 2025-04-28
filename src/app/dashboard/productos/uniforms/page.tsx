import { useState } from "react"
import { UniformeCard } from "@/app/components/uniformes/UniformeCard"
import { CategoryFilter } from "@/app/components/uniformes/CategoryFilter"
import { PageHeader } from "@/app/components/uniformes/PageHeader"
import { toast, useToast } from "@/app/components/ui/use-toast"
import { ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"

export default function UniformesPage() {
  const { toast } = useToast()
  const [carrito, setCarrito] = useState<{ [key: string]: boolean }>({})
  const [tallas, setTallas] = useState<{ [key: string]: string }>({})
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({})
  const [carritoCount, setCarritoCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  const agregarAlCarrito = (id: string) => {
    if (!tallas[id]) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de agregar al carrito",
        variant: "destructive",
      })
      return
    }

    setCarrito({ ...carrito, [id]: true })
    setCarritoCount(carritoCount + 1)
    toast({
      title: "Producto agregado al carrito",
      description: `${uniformesData.find((u) => u.id === id)?.nombre} (Talla: ${tallas[id]}, Cantidad: ${cantidades[id] || 1}) ha sido agregado al carrito.`,
      duration: 3000,
    })
  }

  const uniformesFiltrados = uniformesData.filter((uniforme) => {
    const matchesSearch =
      uniforme.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uniforme.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || uniforme.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader carritoCount={carritoCount} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {uniformesFiltrados.map((uniforme) => (
          <UniformeCard
            key={uniforme.id}
            uniforme={uniforme}
            tallaSeleccionada={tallas[uniforme.id]}
            setTallas={setTallas}
            cantidad={cantidades[uniforme.id] || 1}
            setCantidades={setCantidades}
            carrito={carrito}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </motion.div>

      {uniformesFiltrados.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No se encontraron uniformes</h3>
          <p className="text-gray-500 mt-2">Intenta con otra búsqueda o categoría</p>
          <Button
            className="mt-4 bg-pink-600 hover:bg-pink-700"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("todos")
            }}
          >
            Ver todos los uniformes
          </Button>
        </div>
      )}
    </div>
  )
}
