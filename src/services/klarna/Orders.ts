import KlarnaApi from '../../clients/Klarna';

export default class KlarnaOrders {
  private klarna: KlarnaApi;

  constructor() {
    this.klarna = new KlarnaApi();
  }

  async getOrder(orderId: string) {
    try {

      let data = await this.klarna.get(
        `/ordermanagement/v1/orders/${orderId}`,
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        reference_id: '',
      };
    }
  }

  async capturePayment(orderId: string, captured_amount: number, order_lines: any) {
    try {
      let body = {
        captured_amount,
        order_lines
      };

      let data = await this.klarna.post(
        `/ordermanagement/v1/orders/${orderId}/captures`,
        body,
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        reference_id: '',
      };
    }
  }
}
