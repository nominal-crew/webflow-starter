import { deployEnvironment } from './r2-deploy.mjs';

let deployQueue = Promise.resolve();

export function stagingAutoDeployPlugin() {
  return {
    name: 'staging-auto-deploy',
    async closeBundle() {
      deployQueue = deployQueue
        .then(async () => {
          await deployEnvironment('staging');
        })
        .catch((error) => {
          console.error('[staging-auto-deploy]', error.message);
        });

      await deployQueue;
    }
  };
}
