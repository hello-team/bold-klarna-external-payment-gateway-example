import Klarna from '../../../services/klarna/KlarnaService';


export default class OrderChangedEvent {
    private klarna: Klarna;

    constructor() {
      this.klarna = new Klarna();
    }
    
    async handle(shop: string, order: any, cart: any, cartParams: any): Promise<any> {
      if (order?.shipping.length !== 0) {
        return {
          success: true,
          actions: [],
        };
      }
  
      let klarnaSessionBody = await this.klarna.updateSession(order, cart, cartParams);
  
      return {
        success: true,
        actions: [
          {
            type: 'ADD_CART_PARAMS',
            data: {
              cart_params: {
                klarna: {
                  client_token: cartParams.klarna.client_token,
                  klarna_cart: klarnaSessionBody,
                  session_id: cartParams.klarna.session_id,
                },
              },
            },
          },
        ],
      };
    }
  }
  