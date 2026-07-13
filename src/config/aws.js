import { env } from './env.js';

export function getAwsClientConfig() {
  const config = { region: env.aws.region };

  if (env.aws.accessKeyId && env.aws.secretAccessKey) {
    config.credentials = {
      accessKeyId: env.aws.accessKeyId,
      secretAccessKey: env.aws.secretAccessKey,
    };
  }

  if (env.aws.endpoint) {
    config.endpoint = env.aws.endpoint;
    config.forcePathStyle = true;
  }

  return config;
}
