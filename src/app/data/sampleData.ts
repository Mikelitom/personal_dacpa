import { TutelaryData, StudentData } from "@/app/types/profile"

export const sampleData = {
  tutelary: {
    nombre: "Juan Pérez Rodríguez",
    email: "juan.perez@gmail.com",
    telefono: "555-123-4567",
    direccion: "Calle Principal #123, Colonia Centro",
    ciudad: "Ciudad de México",
    codigoPostal: "01234",
  } as TutelaryData,
  
  students: [
    {
      id: 1,
      nombre: "Ana Pérez González",
      grado: "1°",
      grupo: "A",
      matricula: "EST2024-001",
      fechaNacimiento: "15/05/2016",
      padre: "Juan Pérez Rodríguez",
      madre: "María González López",
      imagen: "/placeholder.svg?height=200&width=200",
      convenio: {
        tipo: "Convenio por atraso",
        descuento: "10%",
        vigencia: "01/05/2024 - 31/05/2024",
      },
      historialPagos: [
        { mes: "Enero", estado: "Pagado", fecha: "10/01/2024", monto: 1500 },
        { mes: "Febrero", estado: "Pagado", fecha: "08/02/2024", monto: 1500 },
        { mes: "Marzo", estado: "Pagado", fecha: "12/03/2024", monto: 1650 },
        { mes: "Abril", estado: "Pagado", fecha: "09/04/2024", monto: 1500 },
        { mes: "Mayo", estado: "Pendiente", vencimiento: "10/05/2024", monto: 1500 },
      ],
    },
    {
      id: 2,
      nombre: "Carlos Pérez González",
      grado: "3°",
      grupo: "B",
      matricula: "EST2024-002",
      fechaNacimiento: "22/08/2014",
      padre: "Juan Pérez Rodríguez",
      madre: "María González López",
      imagen: "/placeholder.svg?height=200&width=200",
      historialPagos: [
        { mes: "Enero", estado: "Pagado", fecha: "10/01/2024", monto: 1500 },
        { mes: "Febrero", estado: "Pagado", fecha: "08/02/2024", monto: 1500 },
        { mes: "Marzo", estado: "Pagado", fecha: "12/03/2024", monto: 1650 },
        { mes: "Abril", estado: "Pagado", fecha: "09/04/2024", monto: 1500 },
        { mes: "Mayo", estado: "Pendiente", vencimiento: "10/05/2024", monto: 1500 },
      ],
    },
  ] as StudentData[],
}