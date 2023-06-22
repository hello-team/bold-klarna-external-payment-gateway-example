import Klarna from '../../../services/klarna/KlarnaService';

export default class InitializeCheckoutEvent {
  private klarna: Klarna;

  constructor() {
    this.klarna = new Klarna();
  }

  async handle(shop:string, order: any, cart: any): Promise<any> {
    const klarnaSessionBody = await this.klarna.sessionBody(shop, order, cart);
    let session: any = await this.klarna.createSession(klarnaSessionBody);
    await this.klarna.updateSession(session.session_id, {merchant_data: shop, merchant_reference1: order.public_order_id})
    console.log({session: session.session_id})
    return {
      success: true,
      actions: [
        {
          type: 'ADD_CART_PARAMS',
          data: {
            cart_params: {
              klarna: {
                client_token: session.client_token,
                session_id: session.session_id,
              },
            },
          },
        },
      ],
    };
  }
}
