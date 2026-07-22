import dotenv from 'dotenv';
import { env } from '../config/env.js';
import { EnvToggle } from '../models/envToggle.model.js';

function parseBoolean(value) {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  return ['true', '1', 'yes'].includes(String(value).trim().toLowerCase());
}

async function syncEnvToggle() {
  dotenv.config({ override: true });

  const rawValue = process.env[env.envToggleKey];
  const value = parseBoolean(rawValue);

  await EnvToggle.findOneAndUpdate(
    { key: env.envToggleKey },
    { key: env.envToggleKey, value },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  console.log(`[env-toggle] ${env.envToggleKey} synced to MongoDB: ${value}`);
}

export function startEnvToggleSync() {
  const runSync = () => {
    syncEnvToggle().catch((error) => {
      console.error('[env-toggle] sync failed:', error.message);
    });
  };

  runSync();

  const intervalId = setInterval(runSync, env.envToggleIntervalMs);

  return () => clearInterval(intervalId);
}
