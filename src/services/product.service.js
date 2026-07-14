/**
 * LEARNING: Drizzle CRUD queries
 * ------------------------------
 * Compare each function to the old raw SQL version:
 *
 *   SQL:  INSERT INTO products (...) VALUES (...) RETURNING *
 *   Drizzle: db.insert(products).values(...).returning()
 *
 * Useful helpers from drizzle-orm:
 *   eq(column, value)  → WHERE column = value
 *   desc(column)       → ORDER BY column DESC
 */
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { products } from '../db/schema/products.js';

export async function createProduct({ name, description = '', price = 0, stock = 0 }) {
  // LEARNING: .returning() is like SQL RETURNING * — get the inserted row back
  const [product] = await db
    .insert(products)
    .values({
      name,
      description,
      // numeric columns: pass as string or number; Drizzle stores as decimal string
      price: String(price),
      stock,
    })
    .returning();

  return product;
}

export async function getAllProducts() {
  // LEARNING: No WHERE → SELECT * FROM products
  // .orderBy(desc(products.createdAt)) → ORDER BY created_at DESC
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getProductById(id) {
  // LEARNING: eq(products.id, id) → WHERE id = $1
  // Result is always an array; take [0] or null
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)))
    .limit(1);

  return product || null;
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id);
  if (!existing) return null;

  const [product] = await db
    .update(products)
    .set({
      // LEARNING: Keep existing values when a field is omitted (partial updates)
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      price: data.price !== undefined ? String(data.price) : existing.price,
      stock: data.stock ?? existing.stock,
      // Always bump updatedAt on change
      updatedAt: new Date(),
    })
    .where(eq(products.id, Number(id)))
    .returning();

  return product;
}

export async function deleteProduct(id) {
  // LEARNING: .returning() after delete gives you the deleted row (or empty array)
  const [product] = await db
    .delete(products)
    .where(eq(products.id, Number(id)))
    .returning();

  return product || null;
}
