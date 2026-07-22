import app from './app.js';
import { connectDB } from './config/db.js';
import { connectPostgres } from './config/postgres.js';
import { env } from './config/env.js';
import { startEnvToggleSync } from './services/envToggleSync.service.js';

async function start() {
  await connectDB();
  await connectPostgres();

  const stopEnvToggleSync = startEnvToggleSync();

  const server = app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Env toggle sync running every ${env.envToggleIntervalMs}ms`);
  });

  const shutdown = () => {
    stopEnvToggleSync();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
