import { gsap } from '../core/gsap.js';

export const defaultTransition = {
  enter({ next, reducedMotion }) {
    const tl = gsap.timeline();

    if (reducedMotion) {
      return tl.set(next, { autoAlpha: 1 });
    }

    return tl.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1 });
  },

  leave({ current, reducedMotion }) {
    const tl = gsap.timeline();

    if (reducedMotion) {
      return tl.set(current, { autoAlpha: 0 });
    }

    return tl.to(current, {
      autoAlpha: 0,
      duration: 0.4
    });
  }
};
