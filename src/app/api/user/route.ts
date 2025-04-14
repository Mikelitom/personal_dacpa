export async function GET() {
  const userData = {
    name: "Juan Pérez",
    notifications: 4,
    nextPayment: {
      date: "10 de mayo de 2024",
      amount: 1500,
    },
    students: [
      {
        id: 1,
        name: "Ana Pérez González",
        grade: "1°A",
        image: "/placeholder.svg?height=120&width=120",
        hasConvenio: true,
        convenioType: "Beca parcial 25%",
        colegiaturaRegular: 2000,
        colegiaturaConvenio: 1500,
      },
      {
        id: 2,
        name: "Carlos Pérez González",
        grade: "3°B",
        image: "/placeholder.svg?height=120&width=120",
        hasConvenio: false,
      },
    ],
    paymentDates: [
      { day: 10, month: 5, year: 2024, type: "payment", description: "Fecha límite de pago sin recargos" },
      { day: 12, month: 5, year: 2024, type: "deadline", description: "Fecha de aplicación de recargos" },
      { day: 20, month: 5, year: 2024, type: "event", description: "Último día para pago con recargos" },
    ],  
  }
  return Response.json(userData); 
}
