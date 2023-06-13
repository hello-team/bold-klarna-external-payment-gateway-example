import KlarnaApi from '../../clients/Klarna';

export default class KlarnaPayments {
  private klarna: KlarnaApi;

  constructor() {
    this.klarna = new KlarnaApi();
  }

  async preAuthPayment(order: any, payment: any) {
    try {
      let body = {
        authorization_token: payment.metadata.note,
        auto_capture: false,
        locale: 'en-US',
        order_amount: order.total,
        order_lines: order.cart_params.klarna.klarna_cart.order_lines,
        purchase_country: order.cart_params.klarna.klarna_cart.purchase_country,
        purchase_currency:
          order.cart_params.klarna.klarna_cart.purchase_currency,
        shipping_address: order.cart_params.klarna.klarna_cart.shipping_address,
        billing_address: order.cart_params.klarna.klarna_cart.billing_address,
      };

      let data = await this.klarna.post(
        `/payments/v1/authorizations/${payment.metadata.note}/order`,
        body,
      );
      console.log(data);
      return {
        success: true,
        reference_id: data.order_id,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        reference_id: '',
      };
    }
  }
}
