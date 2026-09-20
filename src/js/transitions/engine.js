import barba from '@barba/core';

import { config } from '../core/config.js';
import { gsap, ScrollTrigger } from '../core/gsap.js';
import { initLenis, stopLenis, startLenis } from '../core/lenis.js';
import { initRefresh, refreshWebflowForms } from '../core/refresh.js';
import { prefersReducedMotion } from '../core/reducedMotion.js';

import { once, beforeEnter, afterEnter } from '../project/lifecycle.js';
import { transition } from '../project/transition.js';

import { resetPage } from './helpers.js';
import { updateBarbaNav } from './navUpdate.js';
import { applyThemeFrom } from './theme.js';

let onceInitialized = false;

export function initPageTransitions() {
  history.scrollRestoration = 'manual';

  barba.hooks.beforeEnter((data) => {
    const next = data.next.container;

    gsap.set(next, {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0
    });

    stopLenis();

    beforeEnter({
      container: next,
      data
    });

    applyThemeFrom(next);
  });

  barba.hooks.afterLeave(() => {
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });
  });

  barba.hooks.enter((data) => {
    updateBarbaNav(data);
  });

  barba.hooks.afterEnter((data) => {
    const next = data.next.container;

    afterEnter({
      container: next,
      data
    });

    refreshWebflowForms();

    startLenis();
    initRefresh();
  });

  barba.init({
    debug: config.barba.debug,
    timeout: config.barba.timeout,
    preventRunning: config.barba.preventRunning,

    transitions: [
      {
        name: 'default',
        sync: config.barba.sync,

        async once(data) {
          const next = data.next.container;

          initLenis();

          if (!onceInitialized) {
            onceInitialized = true;

            once({
              container: next,
              data
            });
          }

          // The beforeEnter hook pins the container, including on first load.
          // Clear it before the intro animation, not after, so a custom
          // transition.once() never runs against a fixed container.
          resetPage(next);

          await transition.once?.({
            next,
            reducedMotion: prefersReducedMotion(),
            data
          });
        },

        async leave(data) {
          const current = data.current.container;
          const next = data.next.container;

          await transition.leave?.({
            current,
            next,
            reducedMotion: prefersReducedMotion(),
            data
          });

          current.remove();
        },

        async enter(data) {
          const current = data.current?.container;
          const next = data.next.container;

          await transition.enter?.({
            current,
            next,
            reducedMotion: prefersReducedMotion(),
            data
          });

          resetPage(next);
        }
      }
    ]
  });
}
