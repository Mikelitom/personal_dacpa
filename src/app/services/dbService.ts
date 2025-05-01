import { supabase, createServerSupabaseClient } from "@/app/lib/supabase";
import { Database } from "@/app/lib/types";
import { id } from "date-fns/locale";

type Usuario = Database["public"]["Tables"]["Usuario"]["Row"];
type PadreFamilia = Database["public"]["Tables"]["PadreFamilia"]["Row"];
// type HistoriaDesarrollo = Database['public']['Tables']['HistoriaDesarrollo']['Row'];
type Articulo = Database["public"]["Tables"]["Articulo"]["Row"];
// type CompraProveedor = Database['public']['Tables']['CompraProveedor']['Row'];
// type CompraArticulo = Database['public']['Tables']['CompraArticulo']['Row'];
type HistorialPago = Database["public"]["Tables"]["HistorialPago"]["Row"];
type Alumno = Database["public"]["Tables"]["Alumno"]["Row"];
type Convenio = Database["public"]["Tables"]["Convenio"]["Row"];
type Deudor = Database["public"]["Tables"]["Deudor"]["Row"];
type PagoColegiatura = Database["public"]["Tables"]["PagoColegiatura"]["Row"];
type Reporte = Database["public"]["Tables"]["Reporte"]["Row"];
// type Merma = Database['public']['Tables']['Merma']['Row'];
type Pedido = Database["public"]["Tables"]["Pedido"]["Row"];
type PedidoArticulo = Database["public"]["Tables"]["PedidoArticulo"]["Row"];

export const userService = {
  async getUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase.from("Usuario").select("*");

    if (error) {
      throw new Error(`Error fetching Usuarios: ${error.message}`);
    }

    return data || [];
  },
  async getUsuarioById(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from("Usuario")
      .select("*")
      .eq("id_usuario", id)
      .single();

    if (error) {
      if (error.code === "PGRST116")
        throw new Error(`Error fetching Usuario: ${error.message}`);
    }

    return data;
  },
  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from("Usuario")
      .select("*")
      .eq("correo", email);

    if (error) {
      if (error.code === "PGRST116")
        throw new Error(`Error fetching Usuario: ${error.message}`);
      return null;
    }

    return data[0];
  },
  async getPadresFamilia(): Promise<PadreFamilia[]> {
    const { data, error } = await supabase.from("PadreFamilia").select("*");

    if (error) {
      throw new Error(`Error fetching PadreFamilia: ${error.message}`);
    }

    return data || [];
  },
  async getPadreFamiliaById(id: string): Promise<PadreFamilia | null> {
    const { data, error } = await supabase
      .from("PadreFamilia")
      .select("*")
      .eq("id_padre", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // <- más consistente con el otro método
      }
      throw new Error(`Error fetching PadreFamilia: ${error.message}`);
    }

    return data;
  },
  async getPadreFamiliaFromUsuario(
    email: string
  ): Promise<PadreFamilia | null> {
    try {
      // Primero obtenemos el usuario por email
      const { data: usuario, error: usuarioError } = await supabase
        .from("Usuario") // Asegúrate de que este sea el nombre correcto de tu tabla
        .select("id_padre")
        .eq("correo", email)
        .single();

      if (usuarioError) {
        console.error("Error al buscar usuario:", usuarioError.message);
        return null;
      }

      // Verificamos si el usuario existe y tiene un id_padre
      if (!usuario || !usuario.id_padre) {
        return null;
      }

      // Buscamos el padre de familia usando el id_padre del usuario
      const { data: padreFamilia, error: padreError } = await supabase
        .from("PadreFamilia") // Asegúrate de que este sea el nombre correcto de tu tabla
        .select("*")
        .eq("id_padre", "2")
        .single();

      if (padreError) {
        console.error("Error al buscar padre de familia:", padreError.message);
        return null;
      }

      return padreFamilia;
    } catch (error) {
      console.error("Error en getPadreFamiliaFromUsuario:", error);
      return null;
    }
  },
  async getArticulos(): Promise<Articulo[]> {
    const { data, error } = await supabase.from("Articulo").select("*");

    if (error) throw new Error(`Error fetching Articulo: ${error.message}`);

    return data || [];
  },
  async getArticulosByCategoria(categoria: string): Promise<Articulo[]> {
    const { data, error } = await supabase
      .from("Articulo")
      .select("*")
      .eq("categoria", categoria);

    if (error) throw new Error(`Error fetching ${categoria}: ${error.message}`);

    return data || [];
  },
  async getHistorialPago(): Promise<HistorialPago[]> {
    const { data, error } = await supabase.from("HistorialPago").select("*");

    if (error)
      throw new Error(`Error fetching historial de pagos: ${error.message}`);

    return data || [];
  },
  async getAlumnos(): Promise<Alumno[]> {
    const { data, error } = await supabase.from("Alumno").select("*");

    if (error) throw new Error(`Error fetching alumnos: ${error.message}`);

    return data || [];
  },
  async getAlumnoById(id: string): Promise<Alumno | null> {
    const { data, error } = await supabase
      .from("Alumno")
      .select("*")
      .eq("id_alumno", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Error fetching alumno: ${error.message}`);
    }

    return data;
  },
  async getAlumnoByParentId(id: string): Promise<Alumno[]> {
    const { data, error } = await supabase
      .from("Alumno")
      .select("*")
      .eq("id_padre", id);

    if (error) {
      throw new Error(`Error fetching alumno: ${error.message}`);
    }

    return data || [];
  },
  async getConvenioByIdAlumno(id: string): Promise<Convenio[]> {
    const { data, error } = await supabase
      .from("Convenio")
      .select("*")
      .eq("id_alumno", id);

    if (error) throw new Error(`Error fetching convenios. ${error.message}`);

    return data || null;
  },
  async getConvenioByIdPadre(id: string): Promise<Convenio[]> {
    const { data, error } = await supabase
      .from("Convenio")
      .select("*")
      .eq("id_padre", id);

    if (error) throw new Error(`Error fetching convenios. ${error.message}`);

    return data || [];
  },
  async getReportes() {
    const { data, error } = await supabase.from("Reporte").select("*");

    if (error) throw new Error(`Error fetching Reporte: ${error.message}`);

    return data || [];
  },
  async getReporteByIdUsuario(id: string): Promise<Reporte[]> {
    const { data, error } = await supabase
      .from("Reporte")
      .select("*")
      .eq("generado_por", id);

    if (error)
      throw new Error(`[dbService] Error fetching Reportes. ${error.message}`);

    return data || [];
  },
  async getAllPagadosByAlumno(id: string): Promise<PagoColegiatura[]> {
    const { data, error } = await supabase
      .from("PagoColegiatura")
      .select("*")
      .eq("id_alumno", id)
      .eq("estado", "pagado")
      .maybeSingle();

    if (error) throw new Error("[dbService] Error fetching paid payments.");

    return data || [];
  },
  async getPagosByAlumno(id: string): Promise<PagoColegiatura[]> {
    const { data, error } = await supabase
      .from("PagoColegiatura")
      .select("*")
      .eq("id_alumno", id)
      .order("fecha_pago", { ascending: true });

    if (error) throw new Error("[dbService] Error fetching payments");

    return data || [];
  },
  async getSiguientePagoAlumno(id: string): Promise<PagoColegiatura> {
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("PagoColegiatura")
      .select("*")
      .eq("id_alumno", id)
      .gt("fecha_pago", today)
      .order("fecha_pago", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`[dbService] Error fetching next payments.`);

    return data || null;
  },
  async getSiguientesPagosAlumno(id: string): Promise<PagoColegiatura> {
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("PagoColegiatura")
      .select("*")
      .eq("id_alumno", id)
      .gt("fecha_pago", today)
      .order("fecha_pago", { ascending: true })
      .maybeSingle();

    if (error) throw new Error(`[dbService] Error fetching next payments.`);

    return data || [];
  },
  async updateUsuario(usuario: Usuario) {
    if (!usuario.id_usuario) {
      throw new Error('El ID usuario es necesario para actualizar')
    }

    const { error } = await supabase
      .from('Usuario')
      .update(usuario)
      .eq('id_usuario', usuario.id_usuario)

    if (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`)
    }
  },
  async updatePadre(padre: PadreFamilia) {
    if (!padre.id_padre) {
      throw new Error('El ID padre es necesario para actualizar')
    }

    const { error } = await supabase
      .from('padre')
      .update(padre)
      .eq('id_padre', padre.id_padre)

    if (error) {
      throw new Error(`Error actualizando padre: ${error.message}`)
    }
  }
};
