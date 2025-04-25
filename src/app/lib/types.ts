export type Database = {
  public: {
    Tables: {
      Usuario: {
        Row: {
          id_usuario: number;
          nombre_completo: string;
          correo: string;
          telefono: string;
          rol: string;
          departamento: string | null;
          estado: string;
          create_at: string;
          id_padre: number;
        };
        Insert: {
          id_usuario?: number;
          nombre_completo: string;
          correo: string;
          telefono: string;
          rol: string;
          departamento: string | null;
          estado: string;
          create_at?: string;
          id_padre: number;
        };
        Update: {
          id_usuario?: number;
          nombre_completo?: string;
          correo?: string;
          telefono?: string;
          rol?: string;
          departamento?: string | null;
          estado?: string;
          create_at?: string;
          id_padre?: number;
        };
      };
      PadreFamilia: {
        Row: {
          id_padre: number;
          direccion: string;
          ingreso_economico: string;
          escolaridad: string;
          ocupacion: string;
        };
        Insert: {
          id_padre: number;
          direccion?: string;
          ingreso_economico?: string;
          escolaridad?: string;
          ocupacion?: string;
        };
        Update: {
          id_padre?: number;
          direccion?: string;
          ingreso_economico?: string;
          escolaridad?: string;
          ocupacion?: string;
        };
      };
      HistoriaDesarrollo: {
        Row: {
          id_alumno: number;
          embarazo: string;
          parto: string;
          lactancia: string;
          tiempo_lactancia: string;
          talla: string;
          peso: string;
          malformaciones: string;
          enfermedades: string;
          vacunas: string;
          alergias: string;
          servicio_medico: string;
          control_esfinteres_dia: string;
          control_esfinteres_noche: string;
          horas_sueño: number;
          tipo_sueño: string;
          cama_independiente: boolean;
          cama_compartida: boolean;
          desayuno: string;
          comida: string;
          cena: string;
          edad_camino: string;
          edad_habla: string;
          lateralidad: string;
          lenguaje: string;
        };
        Insert: {
          id_alumno: number;
          embarazo?: string;
          parto?: string;
          lactancia?: string;
          tiempo_lactancia?: string;
          talla?: string;
          peso?: string;
          malformaciones?: string;
          enfermedades?: string;
          vacunas?: string;
          alergias?: string;
          servicio_medico?: string;
          control_esfinteres_dia?: string;
          control_esfinteres_noche?: string;
          horas_sueño?: number;
          tipo_sueño?: string;
          cama_independiente?: boolean;
          cama_compartida?: boolean;
          desayuno?: string;
          comida?: string;
          cena?: string;
          edad_camino?: string;
          edad_habla?: string;
          lateralidad?: string;
          lenguaje?: string;
        };
        Update: {
          id_alumno?: number;
          embarazo?: string;
          parto?: string;
          lactancia?: string;
          tiempo_lactancia?: string;
          talla?: string;
          peso?: string;
          malformaciones?: string;
          enfermedades?: string;
          vacunas?: string;
          alergias?: string;
          servicio_medico?: string;
          control_esfinteres_dia?: string;
          control_esfinteres_noche?: string;
          horas_sueño?: number;
          tipo_sueño?: string;
          cama_independiente?: boolean;
          cama_compartida?: boolean;
          desayuno?: string;
          comida?: string;
          cena?: string;
          edad_camino?: string;
          edad_habla?: string;
          lateralidad?: string;
          lenguaje?: string;
        };
      };
      Articulo: {
        Row: {
          id_articulo: number;
          nombre: string;
          categoria: string;
          descripcion: string;
          sku: string;
          codigo_barras: string;
          imagen_url: string;
          proveedor: string;
          precio_venta: number;
          precio_adquisicion: number;
          stock_actual: number;
          stock_minimo: number;
          stock_inicial: number;
          ultima_actualizacion: string;
        };
        Insert: {
          id_articulo: number;
          nombre?: string;
          categoria?: string;
          descripcion?: string;
          sku?: string;
          codigo_barras?: string;
          imagen_url?: string;
          proveedor?: string;
          precio_venta?: number;
          precio_adquisicion?: number;
          stock_actual?: number;
          stock_minimo?: number;
          stock_inicial?: number;
          ultima_actualizacion?: string;
        };
        Update: {
          id_articulo?: number;
          nombre?: string;
          categoria?: string;
          descripcion?: string;
          sku?: string;
          codigo_barras?: string;
          imagen_url?: string;
          proveedor?: string;
          precio_venta?: number;
          precio_adquisicion?: number;
          stock_actual?: number;
          stock_minimo?: number;
          stock_inicial?: number;
          ultima_actualizacion?: string;
        };
      };
      CompraProveedor: {
        Row: {
          id_compra_proveedor: number;
          proveedor: string;
          fecha: string;
          total: number;
          estado: string;
        };
        Insert: {
          id_compra_proveedor: number;
          proveedor?: string;
          fecha?: string;
          total?: number;
          estado?: string;
        };
        Update: {
          id_compra_proveedor?: number;
          proveedor?: string;
          fecha?: string;
          total?: number;
          estado?: string;
        };
      };
      CompraArticulo: {
        Row: {
          id_compraarticulo: number;
          id_compra: number;
          id_articulo: number;
          cantidad: number;
          precio_unitario: number;
        };
        Insert: {
          id_compraarticulo: number;
          id_compra: number;
          id_articulo: number;
          cantidad?: number;
          precio_unitario?: number;
        };
        Update: {
          id_compraarticulo?: number;
          id_compra?: number;
          id_articulo?: number;
          cantidad?: number;
          precio_unitario?: number;
        };
      };
      HistorialPago: {
        Row: {
          id_historial: number;
          id_alumno: number;
          mes: string;
          estado: string;
          fecha_pago: string;
          monto: number;
          recibo_url: string;
          tiene_convenio: boolean;
        };
        Insert: {
          id_historial: number;
          id_alumno: number;
          mes?: string;
          estado?: string;
          fecha_pago?: string;
          monto?: number;
          recibo_url?: string;
          tiene_convenio?: boolean;
        };
        Update: {
          id_historial?: number;
          id_alumno?: number;
          mes?: string;
          estado?: string;
          fecha_pago?: string;
          monto?: number;
          recibo_url?: string;
          tiene_convenio?: boolean;
        };
      };
      Alumno: {
        Row: {
          id_alumno: number;
          id_padre: number;
          nombre: string;
          apellido_paterno: string;
          apellido_materno: string;
          fecha_nacimiento: string;
          grado: string;
          grupo: string;
          ciclo_escolar: string;
          fecha_inscripción: string;
          estado: string;
          convenio: boolean;
        };
        Insert: {
          id_alumno: number;
          id_padre: number;
          nombre?: string;
          apellido_paterno?: string;
          apellido_materno?: string;
          fecha_nacimiento?: string;
          grado?: string;
          grupo: string;
          ciclo_escolar?: string;
          fecha_inscripción?: string;
          estado?: string;
          convenio?: boolean;
        };
        Update: {
          id_alumno?: number;
          id_padre?: number;
          nombre?: string;
          apellido_paterno?: string;
          apellido_materno?: string;
          fecha_nacimiento?: string;
          grado?: string;
          grupo: string;
          ciclo_escolar?: string;
          fecha_inscripción?: string;
          estado?: string;
          convenio?: boolean;
        };
      };
      Convenio: {
        Row: {
          id_convenio: number;
          id_padre: number;
          id_alumno: number;
          porcentaje_incremento: number;
          fecha_inicio: string;
          firmado: boolean;
        };
        Insert: {
          id_convenio: number;
          id_padre: number;
          id_alumno: number;
          porcentaje_incremento?: number;
          fecha_inicio?: string;
          firmado?: boolean;
        };
        Update: {
          id_convenio?: number;
          id_padre?: number;
          id_alumno?: number;
          porcentaje_incremento?: number;
          fecha_inicio?: string;
          firmado?: boolean;
        };
      };
      Deudor: {
        Row: {
          id_deudor: number;
          id_alumno: number;
          id_padre: number;
          monto_pendiente: number;
          meses_adeudo: number;
          ultimo_pago: string;
        };
        Insert: {
          id_deudor: number;
          id_alumno: number;
          id_padre: number;
          monto_pendiente?: number;
          meses_adeudo?: number;
          ultimo_pago?: string;
        };
        Update: {
          id_deudor?: number;
          id_alumno?: number;
          id_padre?: number;
          monto_pendiente?: number;
          meses_adeudo?: number;
          ultimo_pago?: string;
        };
      };
      PagoColegiatura: {
        Row: {
          id_colegiatura: number;
          id_alumno: number;
          concepto: string;
          monto: number;
          fecha_pago: string;
          metodo_pago: string;
          estado: string;
        };

        Insert: {
          id_colegiatura: number;
          id_alumno: number;
          concepto?: string;
          monto?: number;
          fecha_pago?: string;
          metodo_pago?: string;
          estado?: string;
        };
        Update: {
          id_colegiatura?: number;
          id_alumno?: number;
          concepto?: string;
          monto?: number;
          fecha_pago?: string;
          metodo_pago?: string;
          estado?: string;
        };
      };
      Reporte: {
        Row: {
          id_reporte: number;
          tipo: string;
          fecha_inicio: string;
          fecha_fin: string;
          filtro: string;
          generado_por: string;
        };
        Insert: {
          id_reporte: number;
          tipo?: string;
          fecha_inicio?: string;
          fecha_fin?: string;
          filtro?: string;
          generado_por?: string;
        };
        Update: {
          id_reporte?: number;
          tipo?: string;
          fecha_inicio?: string;
          fecha_fin?: string;
          filtro?: string;
          generado_por?: string;
        };
      };
      Merma: {
        Row: {
          id_merma: number;
          id_articulo: number;
          cantidad: number;
          motivo: Text;
          fecha: string;
          id_usuario: number;
        };
        Insert: {
          id_merma: number;
          id_articulo: number;
          cantidad?: number;
          motivo?: Text;
          fecha?: string;
          id_usuario: number;
        };
        Update: {
          id_merma?: number;
          id_articulo?: number;
          cantidad?: number;
          motivo?: Text;
          fecha?: string;
          id_usuario?: number;
        };
      };
      Pedido: {
        Row: {
          id_pedido: number;
          id_padre: number;
          id_alumno: number;
          fecha: string;
          total: number;
          estado: string;
        };
        Insert: {
          id_pedido: number;
          id_padre: number;
          id_alumno: number;
          fecha?: string;
          total?: number;
          estado?: string;
        };
        Update: {
          id_pedido?: number;
          id_padre?: number;
          id_alumno?: number;
          fecha?: string;
          total?: number;
          estado?: string;
        };
      };
      PedidoArticulo: {
        Row: {
          id_pedidoarticulo: number;
          id_pedido: number;
          id_articulo: number;
          cantidad: number;
          precio_unitario: number;
          talla: string;
        };
        Insert: {
          id_pedidoarticulo: number;
          id_pedido: number;
          id_articulo: number;
          cantidad?: number;
          precio_unitario?: number;
          talla?: string;
        };
        Update: {
          id_pedidoarticulo?: number;
          id_pedido?: number;
          id_articulo?: number;
          cantidad?: number;
          precio_unitario?: number;
          talla?: string;
        };
      };
    };
  };
};
