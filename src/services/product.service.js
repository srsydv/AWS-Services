import { pool } from '../config/postgres.js';

export async function createProduct({ name, description = '', price = 0, stock = 0 }) {
  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, price, stock],
  );
  return result.rows[0];
}

export async function getAllProducts() {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
}

export async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id);
  if (!existing) return null;

  const name = data.name ?? existing.name;
  const description = data.description ?? existing.description;
  const price = data.price ?? existing.price;
  const stock = data.stock ?? existing.stock;

  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         stock = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [name, description, price, stock, id],
  );
  return result.rows[0];
}

export async function deleteProduct(id) {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}
