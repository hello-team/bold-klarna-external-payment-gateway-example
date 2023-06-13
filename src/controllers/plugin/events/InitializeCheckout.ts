import Klarna from '../../../services/klarna/KlarnaService';

export default class InitializeCheckoutEvent {
  private klarna: Klarna;

  constructor() {
    this.klarna = new Klarna();
  }

  async handle(shop:string, order: any, cart: any): Promise<any> {
    const klarnaSessionBody = await this.klarna.sessionBody(order, cart);

    let session: any = await this.klarna.createSession(klarnaSessionBody);
    console.log({session_id: session.session_id})
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
