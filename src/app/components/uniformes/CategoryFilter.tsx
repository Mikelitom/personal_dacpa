import { Button } from "@/app/components/ui/button"
import { motion } from "framer-motion"

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const categories = ["todos", "hombres", "mujeres", "niños", "deportivo", "formal"]

export function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  return (
    <motion.div 
      className="flex flex-wrap gap-3 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => setSelectedCategory(category)}
          className="capitalize"
        >
          {category}
        </Button>
      ))}
    </motion.div>
  )
}
