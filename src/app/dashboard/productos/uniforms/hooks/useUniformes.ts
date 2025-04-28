import { useState, useEffect } from 'react';
import { Articulo, UniformeAgrupado } from '@/app/dashboard/productos/types';

export const useUniformes = () => {
  const [uniformes, setUniformes] = useState<UniformeAgrupado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniformes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articulos/Uniforme');
        if (!response.ok) {
          throw new Error('Error al cargar los uniformes');
        }
        
        const data: Articulo[] = await response.json();
        
        // Agrupar los uniformes por nombre (mismo nombre pero diferentes tallas)
        const uniformesAgrupados: Record<string, UniformeAgrupado> = {};
        
        data.forEach(articulo => {
          const nombreUniforme = articulo.nombre;
          
          if (!uniformesAgrupados[nombreUniforme]) {
            uniformesAgrupados[nombreUniforme] = {
              nombre: nombreUniforme,
              descripcion: articulo.descripcion,
              precio: articulo.precio_venta,
              categoria: articulo.categoria,
              imagen_url: articulo.imagen_url,
              tallas: {}
            };
          }
          
          // Asumimos que la descripción contiene la talla
          const talla = articulo.descripcion;
          
          uniformesAgrupados[nombreUniforme].tallas[talla] = {
            id_articulo: articulo.id_articulo,
            stock: articulo.stock_actual,
            sku: articulo.sku
          };
        });
        
        setUniformes(Object.values(uniformesAgrupados));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUniformes();
  }, []);

  return { uniformes, loading, error };
};
