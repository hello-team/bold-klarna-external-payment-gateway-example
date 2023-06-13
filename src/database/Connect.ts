import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { MYSQL_HOST, MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER } from '../constants';

class MySQLDatabase {
  private pool: Pool;

  constructor(config: any) {
    this.pool = mysql.createPool(config);
  }

  public async getConnection(): Promise<PoolConnection> {
    const connection = await this.pool.getConnection();
    return connection;
  }
}

const dbConfig: any = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
};

const database = new MySQLDatabase(dbConfig);

async function createTables() {
  // get connection from the pool
  const connection = await database.getConnection();

  // BigCommerceApi table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS BigCommerceApi (
      shop_slug VARCHAR(255) PRIMARY KEY,
      store_url VARCHAR(255) NOT NULL,
      store_hash VARCHAR(255) NOT NULL,
      client_id VARCHAR(255) NOT NULL,
      access_token VARCHAR(255) NOT NULL,
      secret VARCHAR(255) NOT NULL
    );
  `);

  // Bold table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Bold (
      shop_slug VARCHAR(255) PRIMARY KEY,
      shop_identifier VARCHAR(255) NOT NULL,
      access_token VARCHAR(255) NOT NULL,
      shop_domain VARCHAR(255) NOT NULL,
      platform VARCHAR(255) NOT NULL,
      custom_domain VARCHAR(255) NOT NULL
    );
  `);

  // BoldPlugin table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS BoldPlugin (
      shop_slug VARCHAR(255) PRIMARY KEY,
      plugin_token VARCHAR(255) NOT NULL,
      shop_domain VARCHAR(255) NOT NULL,
      platform VARCHAR(255) NOT NULL
    );
  `);

  await connection.release();
}

// Call createTables function at startup
createTables().catch(console.error);


export default database;
