import KlarnaApi from '../../clients/Klarna';

export default class KlarnaSessions {
  private klarna: KlarnaApi;

  constructor() {
    this.klarna = new KlarnaApi();
  }

  async getSession(sessionId: string) {
    try {

      const data = await this.klarna.get(
        `/payments/v1/sessions/${sessionId}`
      );
      console.log(data);
      return data;
    } catch (error) {
      return error;
    }
  }

  async updateSession(sessionId: string, payload: any) {
    try {

      const data = await this.klarna.post(
        `/payments/v1/sessions/${sessionId}`,
        payload,
      );
      console.log(data);
      return data;
    } catch (error) {
      return error;
    }
  }

  async sessionBody(shop: string, order: any, cart: any) {
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
            name: x.product_title,
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
          merchant_data: shop,
          merchant_reference1: order.public_order_id,
          shipping_address: {
            // Shipping address details
          },
        };

        return sessionBody;
      } else {
        // Handle cart items
        const cartItems = cart.line_items.map((x: any) => {
          return {
            image_url: x.image,
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
