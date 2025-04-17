// src/types/profile.ts
export interface TutelaryData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

export interface PaymentRecord {
  mes: string;
  estado: string;
  fecha?: string;
  vencimiento?: string;
  monto: number;
}

export interface Convention {
  tipo: string;
  descuento: string;
  vigencia: string;
}

export interface StudentData {
  id: number;
  nombre: string;
  grado: string;
  grupo: string;
  matricula: string;
  fechaNacimiento: string;
  padre: string;
  madre: string;
  imagen: string;
  convenio?: Convention;
  historialPagos: PaymentRecord[];
}