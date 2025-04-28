import { Button } from "@/app/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface EmptyResultsProps {
  onReset: () => void;
}

export function EmptyResults({ onReset }: EmptyResultsProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
      <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-700">No se encontraron uniformes</h3>
      <p className="text-gray-500 mt-2">Intenta con otra búsqueda o categoría</p>
      <Button
        className="mt-4 bg-pink-600 hover:bg-pink-700"
        onClick={onReset}
      >
        Ver todos los uniformes
      </Button>
    </div>
  );
}