/**
 * LEARNING: Drizzle DB client
 * --------------------------
 * drizzle(pool, { schema }) wraps the `pg` Pool and gives you a typed query API:
 *   db.select() / db.insert() / db.update() / db.delete()
 *
 * Under the hood Drizzle still uses node-postgres (`pg`) to talk to RDS.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../config/env.js';
import * as schema from './schema/index.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.postgres.host,
  port: env.postgres.port,
  user: env.postgres.user,
  password: env.postgres.password,
  database: env.postgres.database,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

/**
 * LEARNING: Pass { schema } so you can use relational queries later, e.g.:
 *   db.query.products.findMany()
 */
export const db = drizzle(pool, { schema });

export async function connectPostgres() {
  if (!env.postgres.host || !env.postgres.user || !env.postgres.password) {
    throw new Error('POSTGRES_HOST, POSTGRES_USER, and POSTGRES_PASSWORD must be set');
  }

  if (env.postgres.password === 'YOUR_RDS_PASSWORD') {
    throw new Error('Set your real RDS password in POSTGRES_PASSWORD in .env');
  }

  // Simple connectivity check (raw SQL still works via pool if needed)
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('PostgreSQL (RDS) connected via Drizzle');
  } finally {
    client.release();
  }
}
