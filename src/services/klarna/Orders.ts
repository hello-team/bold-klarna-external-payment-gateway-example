import KlarnaApi from '../../clients/Klarna';

export default class KlarnaOrders {
  private klarna: KlarnaApi;

  constructor() {
    this.klarna = new KlarnaApi();
  }

  async capturePayment(order: any, payment: any) {
    try {
      let body = {
        captured_amount: order.total,
        order_lines: order.cart_params.klarna.klarna_cart.order_lines,
      };

      let data = await this.klarna.post(
        `/ordermanagement/v1/orders/${payment.reference_id}/captures`,
        body,
      );
      console.log(data);
      return {
        success: true,
        reference_id: payment.reference_id,
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
