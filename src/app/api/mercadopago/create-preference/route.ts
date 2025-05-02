import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      items,
      payer,
      external_reference,
      notification_url,
      back_urls,
    } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Se requieren items válidos para crear la preferencia" },
        { status: 400 }
      )
    }

    if (!back_urls || typeof back_urls.success !== "string" || !back_urls.success.length) {
      return NextResponse.json(
        { error: "El campo back_urls.success es requerido y debe ser una URL válida para usar auto_return" },
        { status: 400 }
      )
    }
    

    const cleanItems = items.map((item: any) => ({
      id: item.id?.toString(),
      title: item.title || "Item sin título",
      description: item.description || "",
      quantity: Number(item.quantity || 1),
      currency_id: item.currency_id || "MXN",
      unit_price: Number(item.unit_price || 0),
    }))

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: cleanItems,
        payer: {
          name: payer?.name || "Nombre no proporcionado",
          surname: payer?.surname || "",
        },
        external_reference,
        notification_url,
        back_urls: {
          success: back_urls.success,
          failure: back_urls.failure || back_urls.success, // fallback por si falta
          pending: back_urls.pending || back_urls.success, // fallback por si falta
        },
        statement_descriptor: "Colegio - Pago de Colegiatura",
      } as any
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error al crear preferencia de Mercado Pago:", error)
    return NextResponse.json(
      {
        error: "Error al crear preferencia de pago",
        details: error.message || "Error desconocido",
      },
      { status: 500 }
    )
  }
}
