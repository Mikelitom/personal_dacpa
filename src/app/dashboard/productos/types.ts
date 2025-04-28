import { Database } from "@/app/lib/types";

export type Articulo = Database['public']['Tables']['Articulo']['Row']

export type UniformeEnCarrito = {
  articulo: Articulo;
  talla: string;
  cantidad: number;
};

export type UniformeAgrupado = {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  tallas: {
    [talla: string]: {
      id_articulo: number;
      stock: number;
      sku: string;
    }
  }
};