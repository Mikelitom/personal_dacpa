import { Badge } from "@/app/components/ui/badge";

interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return <Badge variant="destructive">Sin existencias</Badge>;
  } else if (stock <= 3) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
        Pocas existencias
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
        En existencia
      </Badge>
    );
  }
}