import Boldv2 from '../../clients/BoldV2';
import BoldAccessTokens from '../../database/bold/AccessTokens';

export default class ExternalPaymentGateways {
  private bold: Boldv2;
  private boldAccessTokens: BoldAccessTokens;

  constructor() {
    this.bold = new Boldv2();
    this.boldAccessTokens = new BoldAccessTokens();
  }

  async createExternalPaymentGateway(shopSlug: string, payload: any): Promise<any> {
    try {
      const document = await this.boldAccessTokens.getShopDocument(shopSlug);
      this.bold.setAccessToken(document.access_token);

      const endpoint = `/checkout/shop/${document.shop_identifier}/external_payment_gateways`;
      const response = await this.bold.post(endpoint, payload);
      return response;
    } catch (error) {
      console.error('Error creating external payment gateway:', error);
      throw error;
    }
  }

  async updateExternalPaymentGateway(shopSlug: string, gatewayId: string, payload: any): Promise<any> {
    try {
      const document = await this.boldAccessTokens.getShopDocument(shopSlug);
      this.bold.setAccessToken(document.access_token);

      const endpoint = `/checkout/shop/${document.shop_identifier}/external_payment_gateways/${gatewayId}`;
      const response = await this.bold.patch(endpoint, payload);
      return response;
    } catch (error) {
      console.error('Error updating external payment gateway:', error);
      throw error;
    }
  }

  async getExternalPaymentGateway(shopSlug: string): Promise<any> {
    try {
      const document = await this.boldAccessTokens.getShopDocument(shopSlug);
      this.bold.setAccessToken(document.access_token);

      const endpoint = `/checkout/shop/${document.shop_identifier}/external_payment_gateways`;
      const response = await this.bold.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error retrieving external payment gateway:', error);
      return error
    }
  }

  async deleteExternalPaymentGateway(shopSlug: string, gatewayId: string): Promise<void> {
    try {
      const document = await this.boldAccessTokens.getShopDocument(shopSlug);
      this.bold.setAccessToken(document.access_token);

      const endpoint = `/checkout/shop/${document.shop_identifier}/external_payment_gateways/${gatewayId}`;
      await this.bold.delete(endpoint);
    } catch (error) {
      console.error('Error deleting external payment gateway:', error);
      throw error;
    }
  }
}
