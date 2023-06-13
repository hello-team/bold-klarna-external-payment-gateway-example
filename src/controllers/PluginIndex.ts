
import * as dotenv from 'dotenv';
import {InitializeCheckoutEvent, ReceivedShippingLinesEvent, OrderChangedEvent} from './plugin/events';


dotenv.config();

export default class CheckoutV1 {

  private initializeCheckoutEvent: InitializeCheckoutEvent;
  private receivedShippingLinesEvent: ReceivedShippingLinesEvent;
  private orderChangedEvent: OrderChangedEvent;

  constructor() {

    this.initializeCheckoutEvent = new InitializeCheckoutEvent();
    this.receivedShippingLinesEvent = new ReceivedShippingLinesEvent();
    this.orderChangedEvent = new OrderChangedEvent();
  }

  async cashierEvents(req: any) {
    try {
      let event = req.body.event;
      const shop = req.query.shop as string;
      const properties = req.body?.properties;
      const order = req.body.order;
      const cart = req.body.cart;
      const cartParams = req.body.cart_params;

      console.log({ event });
      
      if (event === 'initialize_checkout') {
        return this.initializeCheckoutEvent.handle(shop, order, cart);
      }

      if (event === 'received_shipping_lines') {
        return this.receivedShippingLinesEvent.handle(shop, order, cart, cartParams);
      }

      if (event === 'order_changed' && order?.shipping.length !== 0) {
        return this.orderChangedEvent.handle(shop, order, cart, cartParams);
      }

      if (event === 'app_hook' && properties.hook === 'klarna_add_payment') {
        // ...
      }

      // Handle other events...

    } catch (error) {
      console.log(error);
      return 'ok';
    }
  }
}
