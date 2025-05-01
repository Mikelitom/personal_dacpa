import { Database } from "../lib/types";

export type Usuario = Database['public']['Tables']['Usuario']['Row'];
export type Alumno = Database['public']['Tables']['Alumno']['Row'];
export type Convenio = Database['public']['Tables']['Convenio']['Row'];
export type PagoColegiatura = Database['public']['Tables']['PagoColegiatura']['Row']
export type PadreFamilia = Database['public']['Tables']['PadreFamilia']['Row']