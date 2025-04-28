import { Button } from "@/app/components/ui/button";

interface CategoriaFilterProps {
  categoriaSeleccionada: string;
  onCategoriaChange: (categoria: string) => void;
}

export function CategoriaFilter({ categoriaSeleccionada, onCategoriaChange }: CategoriaFilterProps) {
  const categorias = [
    { id: "todos", label: "Todos" },
    { id: "diario", label: "Diario" },
    { id: "deportivo", label: "Deportivo" },
    { id: "gala", label: "Gala" },
  ];

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-2">
      {categorias.map((categoria) => (
        <Button
          key={categoria.id}
          variant={categoriaSeleccionada === categoria.id ? "default" : "outline"}
          className={
            categoriaSeleccionada === categoria.id
              ? "bg-pink-600 hover:bg-pink-700"
              : "border-pink-200 text-pink-700 hover:bg-pink-50"
          }
          onClick={() => onCategoriaChange(categoria.id)}
        >
          {categoria.label}
        </Button>
      ))}
    </div>
  );
}