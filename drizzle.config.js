/**
 * LEARNING: drizzle.config.js
 * ---------------------------
 * Used by `drizzle-kit` CLI (NOT at runtime).
 *
 * Commands you'll use while learning:
 *   npm run db:push     → push schema to DB (fast for learning, no migration files)
 *   npm run db:generate → create SQL migration files from schema changes
 *   npm run db:migrate  → apply migration files
 *   npm run db:studio   → open Drizzle Studio UI to browse tables
 */
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Where your table schemas live
  schema: './src/db/schema/index.js',

  // Where generated migrations will be saved
  out: './drizzle',

  // Database dialect
  dialect: 'postgresql',

  // Connection to RDS (same vars as your app)
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB || 'postgres',
    ssl: true,
  },
});
