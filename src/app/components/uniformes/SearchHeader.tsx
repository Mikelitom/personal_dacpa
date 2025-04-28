import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { ShoppingBag, ShoppingCart, Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  carritoCount: number;
}

export function SearchHeader({ searchTerm, onSearchChange, carritoCount }: SearchHeaderProps) {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-pink-500" />
          Uniformes Escolares
        </h1>
        <p className="text-gray-500 mt-1">Uniformes oficiales para el ciclo escolar 2024-2025</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar uniformes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white border-gray-200"
          />
        </div>
        <Link href="/dashboard/carrito">
          <Button variant="outline" className="flex items-center w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ver carrito
            {carritoCount > 0 && (
              <Badge variant="default" className="ml-2 bg-pink-500">
                {carritoCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
