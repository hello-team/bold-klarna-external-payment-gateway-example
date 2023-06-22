import KlarnaApi from '../../clients/Klarna';

export default class KlarnaPayments {
  private klarna: KlarnaApi;

  constructor() {
    this.klarna = new KlarnaApi();
  }

  async preAuthPayment(authorizationToken: string, body: any) {
    try {

      let data = await this.klarna.post(
        `/payments/v1/authorizations/${authorizationToken}/order`,
        body,
      );
      console.log(data);
      return {
        success: true,
        token: data.order_id,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        token: '',
      };
    }
  }
}
