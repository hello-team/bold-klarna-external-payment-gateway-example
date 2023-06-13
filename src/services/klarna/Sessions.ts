import KlarnaApi from '../../clients/Klarna';

export default class KlarnaSessions {
  private klarna: KlarnaApi;

  constructor() {
    this.klarna = new KlarnaApi();
  }

  async updateSession(order: any, cart: any, cart_params: any) {
    try {
      let sessionBody = await this.sessionBody(order, cart);

      const data = await this.klarna.post(
        `/payments/v1/sessions${cart_params.klarna.session_id}`,
        sessionBody,
      );
      console.log(data);
      return sessionBody;
    } catch (error) {
      return error;
    }
  }

  async sessionBody(order: any, cart: any) {
    try {
      if (order.shipping.length !== 0) {
        // Handle shipping items
        const shippingItems = order.shipping.map((x: any) => {
          return {
            reference: x.code,
            name: x.name,
            quantity: 1,
            unit_price: x.price,
            tax_rate: 0,
            total_amount: x.price,
            total_discount_amount: 0,
            total_tax_amount: 0,
          };
        });

        // Handle cart items
        const cartItems = cart.line_items.map((x: any) => {
          return {
            reference: x.platform_variant_id,
            name: x.title,
            quantity: x.quantity,
            unit_price: x.price,
            tax_rate: 0,
            total_amount: x.price * x.quantity,
            total_discount_amount: 0,
            total_tax_amount: 0,
          };
        });

        // Combine order lines
        const orderLines = [...cartItems, ...shippingItems];

        // Create session body
        const sessionBody = {
          acquiring_channel: 'ECOMMERCE',
          billing_address: {
            // Billing address details
          },
          locale: 'en-US',
          options: {
            // Session options
          },
          order_amount: order.order_total,
          order_lines: orderLines,
          order_tax_amount: 0,
          purchase_country: order.customer.billing_address.country_code,
          purchase_currency: order.currency,
          shipping_address: {
            // Shipping address details
          },
        };

        return sessionBody;
      } else {
        // Handle cart items
        const cartItems = cart.line_items.map((x: any) => {
          return {
            reference: x.platform_variant_id,
            name: x.title,
            quantity: x.quantity,
            unit_price: x.price,
            tax_rate: 0,
            total_amount: x.price * x.quantity,
            total_discount_amount: 0,
            total_tax_amount: 0,
          };
        });

        // Create session body
        const sessionBody = {
          acquiring_channel: 'ECOMMERCE',
          locale: 'en-US',
          options: {
            // Session options
          },
          order_amount: order.order_total,
          order_lines: cartItems,
          order_tax_amount: 0,
          purchase_country: 'US',
          purchase_currency: order.currency,
        };

        return sessionBody;
      }
    } catch (error) {
      return { error };
    }
  }

  async createSession(session: any) {
    try {
      const data = await this.klarna.post('/payments/v1/sessions', session);
      return data;
    } catch (error) {
      return error;
    }
  }

}
