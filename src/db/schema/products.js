/**
 * LEARNING: Drizzle Schema
 * -----------------------
 * In Drizzle, you define your table structure in code (like Mongoose schemas,
 * but closer to real SQL columns). This file becomes the single source of truth
 * for TypeScript/JS autocomplete AND for generating SQL migrations.
 *
 * Key imports from "drizzle-orm/pg-core":
 * - pgTable  → create a PostgreSQL table
 * - serial   → auto-increment integer (PRIMARY KEY)
 * - varchar  → short string with max length
 * - text     → long string
 * - numeric  → decimal numbers (money, etc.)
 * - integer  → whole numbers
 * - timestamp → date/time
 */
import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * LEARNING: pgTable("table_name", { columns })
 * - First arg = actual SQL table name in Postgres
 * - Second arg = column definitions
 *
 * Equivalent SQL:
 *   CREATE TABLE products (
 *     id SERIAL PRIMARY KEY,
 *     name VARCHAR(255) NOT NULL,
 *     ...
 *   );
 */
export const products = pgTable('products', {
  // LEARNING: serial("id").primaryKey() → INTEGER auto-increment PK
  id: serial('id').primaryKey(),

  // LEARNING: .notNull() makes the column required (NOT NULL in SQL)
  name: varchar('name', { length: 255 }).notNull(),

  // LEARNING: .default('') sets a default when you omit the field
  description: text('description').default(''),

  // LEARNING: numeric is stored as string in JS (e.g. "999.99") to avoid float bugs
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),

  stock: integer('stock').notNull().default(0),

  // LEARNING: { withTimezone: true } → TIMESTAMPTZ in Postgres
  // .defaultNow() → DEFAULT NOW()
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
