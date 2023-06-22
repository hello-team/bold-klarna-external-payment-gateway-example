
import * as dotenv from 'dotenv';
import {InitializeCheckoutEvent} from './plugin/events';


dotenv.config();

export default class CheckoutV1 {
  private initializeCheckoutEvent: InitializeCheckoutEvent;

  constructor() {
    this.initializeCheckoutEvent = new InitializeCheckoutEvent();
  }

  async cashierEvents(req: any) {
    try {
      let event = req.body.event;
      const shop = req.query.shop as string;
      const order = req.body.order;
      const cart = req.body.cart;

      console.log({ event });
      
      if (event === 'initialize_checkout') {
        return this.initializeCheckoutEvent.handle(shop, order, cart);
      }

    } catch (error) {
      console.log(error);
      return 'ok';
    }
  }
}
