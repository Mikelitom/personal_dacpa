import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Plus, Minus } from "lucide-react";

interface CantidadSelectorProps {
  id: string | number;
  cantidad: number;
  setCantidad: (id: string | number, cantidad: number) => void;
}

export function CantidadSelector({ id, cantidad, setCantidad }: CantidadSelectorProps) {
  const incrementar = () => setCantidad(id, cantidad + 1);
  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(id, cantidad - 1);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`cantidad-${id}`}>Cantidad</Label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={decrementar}
          disabled={cantidad <= 1}
          className="border-pink-200 text-pink-700 hover:bg-pink-50"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={`cantidad-${id}`}
          type="number"
          className="w-16 mx-2 text-center bg-white"
          value={cantidad}
          onChange={(e) => {
            const val = Number.parseInt(e.target.value);
            if (val > 0) {
              setCantidad(id, val);
            }
          }}
          min={1}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={incrementar}
          className="border-pink-200 text-pink-700 hover:bg-pink-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}