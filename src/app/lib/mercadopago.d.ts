declare module "mercadopago" {
  export interface MercadoPagoConfig {
    accessToken: string
  }

  export class MercadoPagoConfig {
    constructor(options: { accessToken: string })
  }

  export class Preference {
    constructor(client: MercadoPagoConfig)
    create(options: {
      body: {
        items: Array<{
          id: string
          title: string
          quantity: number
          unit_price: number
          currency_id: string
        }>
        back_urls?: {
          success: string
          failure: string
          pending: string
        }
        notification_url?: string
        auto_return?: string
      }
    }): Promise<{
      id: string
      init_point: string
      sandbox_init_point: string
    }>
  }

  export class Payment {
    constructor(client: MercadoPagoConfig)
    get(options: { id: string }): Promise<{
      id: string
      status: string
      status_detail: string
      transaction_amount: number
      currency_id: string
      additional_info?: {
        items?: Array<{
          id: string
          title: string
          quantity: number
          unit_price: number
        }>
      }
    }>
  }
}

