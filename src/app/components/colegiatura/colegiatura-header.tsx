import { Calendar } from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"

export default function ColegiaturaHeader() {
  return (
    <CardHeader className="pb-2 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-lg text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-pink-500" />
            Colegiaturas {new Date().getFullYear()}
          </CardTitle>
          <CardDescription className="text-gray-600">Selecciona los meses que deseas pagar</CardDescription>
        </div>
      </div>
    </CardHeader>
  )
}
