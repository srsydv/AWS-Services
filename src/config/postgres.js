/**
 * LEARNING: Keep this file as a thin re-export so older imports still work.
 * Prefer importing from `../db/index.js` going forward.
 */
export { connectPostgres, db, pool } from '../db/index.js';
