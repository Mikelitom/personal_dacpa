import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, payer, external_reference, notification_url, back_urls } = body

    // Validar datos requeridos
    if (!items || !items.length) {
      return NextResponse.json({ error: "Se requieren items para crear la preferencia" }, { status: 400 })
    }

    // Crear instancia de preferencia
    const preference = new Preference(client)

    // Crear preferencia de pago
    // Usamos type assertion para evitar errores de TypeScript
    // ya que el SDK tiene tipos incompletos
    const result = await preference.create({
      body: {
        items,
        back_urls,
        notification_url,
        // Usamos @ts-ignore para las propiedades que no están en la definición de tipos
        // @ts-ignore
        payer,
        // @ts-ignore
        external_reference,
        // @ts-ignore
        auto_return: "approved",
        // @ts-ignore
        statement_descriptor: "Colegio - Pago de Colegiatura",
      } as any, // Usamos 'as any' para evitar errores de tipo
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error al crear preferencia de Mercado Pago:", error)
    return NextResponse.json({ error: "Error al crear preferencia de pago", details: error.message }, { status: 500 })
  }
}
