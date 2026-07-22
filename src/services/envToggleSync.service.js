import { env } from '../config/env.js';
import { EnvToggle } from '../models/envToggle.model.js';

async function toggleEnvStatus() {
  const existing = await EnvToggle.findOne({ key: env.envToggleKey });
  const nextValue = existing ? !existing.value : true;

  await EnvToggle.findOneAndUpdate(
    { key: env.envToggleKey },
    { key: env.envToggleKey, value: nextValue },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  console.log(`[env-toggle] ${env.envToggleKey} toggled to: ${nextValue}`);
}

export function startEnvToggleSync() {
  const runToggle = () => {
    toggleEnvStatus().catch((error) => {
      console.error('[env-toggle] toggle failed:', error.message);
    });
  };

  runToggle();

  const intervalId = setInterval(runToggle, 5000);

  return () => clearInterval(intervalId);
}
