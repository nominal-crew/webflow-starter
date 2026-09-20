import { notifyLiveReload, startLiveReloadServer } from './live-reload.mjs';
import { deployEnvironment } from './r2-deploy.mjs';

let deployQueue = Promise.resolve();
let liveReloadStarted = false;

export function stagingAutoDeployPlugin() {
  return {
    name: 'staging-auto-deploy',
    buildStart() {
      if (liveReloadStarted) {
        return;
      }

      liveReloadStarted = true;
      startLiveReloadServer();
    },
    async closeBundle() {
      deployQueue = deployQueue
        .then(async () => {
          await deployEnvironment('staging');
          notifyLiveReload();
        })
        .catch((error) => {
          console.error('[staging-auto-deploy]', error.message);
        });

      await deployQueue;
    }
  };
}
