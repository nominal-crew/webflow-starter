import 'dotenv/config';

import { defineConfig } from 'vite';
import { webflowKit } from '@nominalcrew/webflow-kit';

import config from './webflow.config.js';

export default defineConfig(({ mode }) => ({
  plugins: [
    webflowKit({
      mode,
      ...config,
      cdn: process.env.PUBLIC_ASSET_URL
    })
  ]
}));
