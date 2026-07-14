/**
 * LEARNING SCRIPT: run with  →  npm run db:learn
 *
 * This file is NOT part of the API. It walks through Drizzle basics step by step
 * against your RDS products table so you can see results in the terminal.
 *
 * Prerequisites:
 *   1. .env has POSTGRES_* set
 *   2. npm run db:push   (creates/updates the products table from schema)
 */
import { and, desc, eq, gt, like, sql } from 'drizzle-orm';
import { connectPostgres, db, pool } from './index.js';
import { products } from './schema/products.js';

async function learn() {
  await connectPostgres();

  console.log('\n=== 1) INSERT (create) ===');
  const [created] = await db
    .insert(products)
    .values({
      name: 'Drizzle Learning Mug',
      description: 'Created by learn-examples.js',
      price: '19.99',
      stock: 5,
    })
    .returning();
  console.log(created);

  console.log('\n=== 2) SELECT all (ordered) ===');
  const all = await db.select().from(products).orderBy(desc(products.createdAt)).limit(5);
  console.log(all);

  console.log('\n=== 3) SELECT one by id (WHERE eq) ===');
  const [one] = await db
    .select()
    .from(products)
    .where(eq(products.id, created.id))
    .limit(1);
  console.log(one);

  console.log('\n=== 4) SELECT with filters (price > 10 AND name LIKE %Drizzle%) ===');
  // LEARNING: and() / or() combine multiple conditions in one .where()
  const filtered = await db
    .select()
    .from(products)
    .where(and(gt(products.price, '10'), like(products.name, '%Drizzle%')));
  console.log(filtered);

  console.log('\n=== 5) UPDATE ===');
  const [updated] = await db
    .update(products)
    .set({ stock: 50, updatedAt: new Date() })
    .where(eq(products.id, created.id))
    .returning();
  console.log(updated);

  console.log('\n=== 6) SELECT specific columns only ===');
  const slim = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
    })
    .from(products)
    .where(eq(products.id, created.id));
  console.log(slim);

  console.log('\n=== 7) Raw SQL escape hatch (sql``) ===');
  const countResult = await db.execute(sql`SELECT COUNT(*)::int AS total FROM products`);
  console.log(countResult.rows?.[0] ?? countResult);

  console.log('\n=== 8) DELETE (cleanup learning row) ===');
  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, created.id))
    .returning({ id: products.id, name: products.name });
  console.log(deleted);

  console.log('\nDone. Read src/db/schema/products.js and src/services/product.service.js next.\n');
  await pool.end();
}

learn().catch(async (error) => {
  console.error('Learn script failed:', error.message);
  await pool.end();
  process.exit(1);
});
