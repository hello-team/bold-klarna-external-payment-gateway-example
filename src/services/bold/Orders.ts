import Boldv2 from '../../clients/BoldV2';
import BoldAccessTokens from '../../database/bold/AccessTokens';

export default class BoldOrderService {
    private bold: Boldv2;
    private boldAccessTokens: BoldAccessTokens;

    constructor() {
        this.bold = new Boldv2();
        this.boldAccessTokens = new BoldAccessTokens();
    }

    async getOrderId(shopSlug: string, publicOrderId: string): Promise<any> {
        try {
            const document = await this.boldAccessTokens.getShopDocument(shopSlug);
            this.bold.setAccessToken(document.access_token);

            const endpoint = `/checkout/orders/${document.shop_identifier}/${publicOrderId}`;
            const response = await this.bold.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error creating external payment gateway:', error);
            throw error;
        }
    }


}
