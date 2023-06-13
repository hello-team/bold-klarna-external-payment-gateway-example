import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { IBoldDocument } from 'src/interfaces';
import database from '../Connect';

class BoldAccessTokens {
  private connection: Promise<PoolConnection>;

  constructor() {
    this.connection = database.getConnection();
  }

  async getShopDocument(shopSlug: string): Promise<IBoldDocument> {
    const query = `SELECT * FROM Bold WHERE shop_slug = ?`;
    const params = [shopSlug];
    try {
        const connection = await this.connection
        const [rows] = await connection.query<RowDataPacket[]>(query, params);

        if (rows.length === 0) {
        throw new Error("Unable to find shop access tokens");
      }
      return rows[0] as unknown as IBoldDocument;
    } catch (error) {
      throw new Error("Error retrieving shop access tokens: ");
    }
  }


  async upsertShopAccessTokens(
    shopIdentifier: string,
    accessToken: string,
    shopDomain: string,
    platform: string,
    customDomain: string,
    shopSlug: string
  ) {
    const query = `INSERT INTO Bold (shop_slug, shop_identifier, access_token, shop_domain, platform, custom_domain)
                   VALUES (?, ?, ?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                   shop_slug = VALUES(shop_slug),
                   shop_identifier = VALUES(shop_identifier),
                   access_token = VALUES(access_token),
                   shop_domain = VALUES(shop_domain),
                   platform = VALUES(platform),
                   custom_domain = VALUES(custom_domain)`;
    const params = [shopSlug, shopIdentifier, accessToken, shopDomain, platform, customDomain];
    try {
      const connection = await this.connection;
      await connection.query(query, params);
    } catch (error) {
      throw new Error("Error upserting shop access tokens: ");
    }
  }

  async deleteShopAccessTokens(shopSlug: string) {
    const query = `DELETE FROM Bold WHERE shop_slug = ?`;
    const params = [shopSlug];
    try {
      const connection = await this.connection;
      await connection.query(query, params);
    } catch (error) {
      throw new Error("Error deleting shop access tokens: ");
    }
  }
}

export default BoldAccessTokens;
