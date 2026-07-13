import app from './app.js';
import { connectDB } from './config/db.js';
import { connectPostgres } from './config/postgres.js';
import { env } from './config/env.js';

async function start() {
  await connectDB();
  await connectPostgres();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
