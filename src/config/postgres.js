import pg from 'pg';
import { env } from './env.js';

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
});

export async function connectPostgres() {
  if (!env.postgres.host || !env.postgres.user || !env.postgres.password) {
    throw new Error('POSTGRES_HOST, POSTGRES_USER, and POSTGRES_PASSWORD must be set');
  }

  if (env.postgres.password === 'YOUR_RDS_PASSWORD') {
    throw new Error('Set your real RDS password in POSTGRES_PASSWORD in .env');
  }

  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('PostgreSQL (RDS) connected');
  } finally {
    client.release();
  }
}
