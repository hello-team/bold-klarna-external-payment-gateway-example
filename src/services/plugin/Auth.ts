import db from '../../database/Connect';
import * as dotenv from 'dotenv';
import FetchApi from '../../clients/FetchApi'
import { CHECKOUT_API_URL, PLUGIN_CLIENT_ID, PLUGIN_CLIENT_SECRET, PLUGIN_SCOPES} from '../../constants'
dotenv.config();
import { PluginTokens } from '../../database/plugin/AccessTokens'

export default class PluginAuthToken {
  private PluginTokens: PluginTokens = new PluginTokens;
  public db = db;

  async install(platform: string, shop: any) {
    try {
      if (typeof platform === 'undefined' || typeof shop === 'undefined') {
        return 'Error: "shop" is required';
      }
      return {
        uri: `${CHECKOUT_API_URL}/api/v1/${platform}/${shop}/oauth/authorize?client_id=${PLUGIN_CLIENT_ID}&scope=${PLUGIN_SCOPES}&response_type=code`,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async init(body: any) {
    try {
      console.log({ body: body });
      let requestData = {
        client_id: PLUGIN_CLIENT_ID,
        client_secret: PLUGIN_CLIENT_SECRET,
        code: body.code,
        grant_type: 'authorization_code',
      };

      if (
        !CHECKOUT_API_URL ||
        CHECKOUT_API_URL === undefined
      ) {
        return { error: 'missing cashier domain' };
      }

      let api = new FetchApi(CHECKOUT_API_URL as string)
      let data = await api.post(`/api/v1/${body.platform}/${body.shop}/oauth/access_token`, requestData)
      console.log(data)
      let shopSlug = data.shop.replace(/\./g, '');
      await this.PluginTokens.upsertPluginAccessTokens(shopSlug, data.access_token, data.shop, data.platform)
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


}