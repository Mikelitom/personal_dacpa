export async function GET() {
  const notificationsList = [
    {
      id: 1,
      title: "Recordatorio de pago",
      message: "El pago de colegiatura de Mayo vence en 5 días.",
      time: "Hace 2 horas",
      type: "payment"
    },
    {
      id: 2,
      title: "Nuevos libros disponibles",
      message: "Ya están disponibles los libros para el próximo ciclo escolar.",
      time: "Ayer",
      type: "info"
    }
  ];

  return Response.json(notificationsList)
}