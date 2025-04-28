import { Input } from "@/app/components/ui/input"
import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"

interface PageHeaderProps {
  carritoCount: number
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export function PageHeader({ carritoCount, searchTerm, setSearchTerm }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
      <motion.h1 
        className="text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Uniformes
      </motion.h1>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar uniformes..."
          value={searchTerm}
          onChange={(e: { target: { value: string } }) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="relative">
          <ShoppingCart className="h-7 w-7 text-gray-600" />
          {carritoCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {carritoCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
