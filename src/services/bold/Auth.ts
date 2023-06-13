import FetchApi from '../../clients/FetchApi';
import Boldv2 from '../../clients/BoldV2';
import BoldAccessTokens from '../../database/bold/AccessTokens';
import {
  APP_URL,
  BOLD_API_URL,
  BOLD_API_V2_AUTH_DASH_URL,
  BOLD_API_V2_SCOPES,
  BOLD_DEVELOPER_CLIENT,
  BOLD_DEVELOPER_SECRET,
} from '../../constants';

export default class AuthToken {
  private boldAccessTokens: BoldAccessTokens;

  constructor() {
    this.boldAccessTokens = new BoldAccessTokens();
  }

  async install() {
    try {
      return {
        uri: `${BOLD_API_V2_AUTH_DASH_URL}?client_id=${BOLD_DEVELOPER_CLIENT}&scope=${BOLD_API_V2_SCOPES}&redirect_uri=${APP_URL}/oauth/authorize`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getShop(token: string) {
    const bold = new Boldv2();
    bold.setAccessToken(token);
    const data = await bold.get('/shops/v1/info');
    console.log({ shop: data });
    data.access_token = token;
    return data;
  }

  async init(body: any) {
    try {
      const requestData = {
        client_id: BOLD_DEVELOPER_CLIENT,
        client_secret: BOLD_DEVELOPER_SECRET,
        code: body.code,
        grant_type: 'authorization_code',
      };

      const api = new FetchApi(BOLD_API_URL);
      const data = await api.post('/auth/oauth2/token', requestData);
      const accessToken = data.access_token;
      const shop = await this.getShop(accessToken);
      console.log(shop);

      if (shop.id) {
        const shopSlug = shop.shop_domain.replace(/\./g, '');
        await this.boldAccessTokens.upsertShopAccessTokens(
          shop.shop_identifier,
          shop.access_token,
          shop.shop_domain,
          shop.platform_slug,
          shop.custom_domain,
          shopSlug
        );
        return shop;
      } else {
        throw new Error('Error: "shop" is required');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
