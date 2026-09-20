import 'dotenv/config';

import { deployEnvironment } from './r2-deploy.mjs';

const environment = process.argv[2];

await deployEnvironment(environment);
