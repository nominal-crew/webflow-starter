import { defaultTransition } from '../transitions/defaultTransition.js';
//import { gsap } from '../core/gsap.js';

export const transition = {
  ...defaultTransition

  // Override only what changes for this project.
  //
  // Example:
  //
  // enter({ next, reducedMotion }) {
  //   if (reducedMotion) {
  //     return gsap.set(next, { autoAlpha: 1 });
  //   }
  //
  //   return gsap.fromTo(
  //     next,
  //     { yPercent: 100 },
  //     { yPercent: 0, duration: 1.2 }
  //   );
  // },
};
