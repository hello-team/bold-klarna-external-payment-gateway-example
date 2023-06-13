import { PoolConnection, RowDataPacket } from 'mysql2/promise';

import { IBoldPluginDocument } from 'src/interfaces';
import database from '../Connect';

export class PluginTokens {
    private connection: Promise<PoolConnection>;

    constructor() {
        this.connection = database.getConnection();
    }

    async getPluginAccessTokens(shopSlug: string): Promise<IBoldPluginDocument> {
        const query = `SELECT * FROM BoldPlugin WHERE shop_slug = ?`;
        const params = [shopSlug];
        try {
            const connection = await this.connection
            const [rows] = await connection.query<RowDataPacket[]>(query, params);
            if (rows.length === 0) {
                throw new Error("Unable to find plugin access tokens");
            }
            return rows[0] as unknown as IBoldPluginDocument;
        } catch (error) {
            throw new Error("Error retrieving plugin access tokens: " + (error as Error).message);;
        }
    }

    async upsertPluginAccessTokens(
        shopSlug: string,
        pluginToken: string,
        shopDomain: string,
        platform: string,
    ) {
        const query = `INSERT INTO BoldPlugin (shop_slug, plugin_token, shop_domain, platform)
                   VALUES (?, ?, ?, ?)
                   ON DUPLICATE KEY UPDATE
                   shop_slug = VALUES(shop_slug),
                   plugin_token = VALUES(plugin_token),
                   shop_domain = VALUES(shop_domain),
                   platform = VALUES(platform)`;
        const params = [shopSlug, pluginToken, shopDomain, platform];
        try {
            const connection = await this.connection
            await connection.query(query, params);
        } catch (error) {
            throw new Error("Error upserting plugin access tokens: " + (error as Error).message);
        }
    }

    async deleteShopAccessTokens(shopSlug: string) {
        const query = `DELETE FROM BoldPlugin WHERE shop_slug = ?`;
        const params = [shopSlug];
        try {
            const connection = await this.connection
            await connection.query(query, params);
        } catch (error) {
            throw new Error("Error deleting plugin access tokens: " + (error as Error).message);
        }
    }
}
