import fs from 'node:fs/promises';
import path from 'node:path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import config from '../webflow.config.js';

const requiredEnvironmentVariables = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];

function assertEnvironmentVariables() {
  for (const variable of requiredEnvironmentVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  }
}

function getPrefix(environment) {
  return environment === 'production'
    ? process.env.R2_PRODUCTION_PREFIX || config.environments.production.path
    : process.env.R2_STAGING_PREFIX || config.environments.staging.path;
}

function createClient() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY
    }
  });
}

export async function deployEnvironment(environment) {
  if (!['staging', 'production'].includes(environment)) {
    throw new Error('Environment must be either "staging" or "production".');
  }

  assertEnvironmentVariables();

  const { R2_BUCKET } = process.env;
  const prefix = getPrefix(environment);
  const client = createClient();

  const files = [
    {
      source: path.resolve('dist', config.assets.js),
      destination: `${prefix}/${config.assets.js}`,
      contentType: 'application/javascript; charset=utf-8'
    },
    {
      source: path.resolve('dist', config.assets.css),
      destination: `${prefix}/${config.assets.css}`,
      contentType: 'text/css; charset=utf-8'
    }
  ];

  for (const file of files) {
    const body = await fs.readFile(file.source);

    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: file.destination,
        Body: body,
        ContentType: file.contentType,
        CacheControl: environment === 'production' ? 'public, max-age=3600' : 'no-cache'
      })
    );

    console.log(`Uploaded: ${file.destination}`);
  }

  console.log(`Deployment complete: ${environment}`);
}
