import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

export async function POST(request: Request) {
  try {
    // Obtener datos de la notificación
    const body = await request.json()

    // Verificar tipo de notificación
    if (body.type !== "payment") {
      return NextResponse.json({ message: "Notificación recibida pero no es de tipo payment" })
    }

    // Obtener ID del pago
    const paymentId = body.data.id

    // Obtener detalles del pago
    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    // Verificar estado del pago
    // @ts-ignore - El tipo no incluye todas las propiedades que devuelve la API
    const status = paymentData.status
    // @ts-ignore - El tipo no incluye todas las propiedades que devuelve la API
    const externalReference = paymentData.external_reference

    // Aquí deberías actualizar tu base de datos con el estado del pago
    // Por ejemplo, marcar las colegiaturas como pagadas si el estado es "approved"

    console.log(`Pago ${paymentId} con referencia ${externalReference} tiene estado: ${status}`)

    // Ejemplo de actualización (pseudocódigo)
    if (status === "approved") {
      // Actualizar estado de colegiaturas en la base de datos
      // await updatePaymentStatus(externalReference, "pagado")
    }

    return NextResponse.json({ success: true, message: "Webhook procesado correctamente" })
  } catch (error: any) {
    console.error("Error al procesar webhook de Mercado Pago:", error)
    return NextResponse.json({ error: "Error al procesar webhook", details: error.message }, { status: 500 })
  }
}
