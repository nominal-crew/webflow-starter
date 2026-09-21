import { gsap } from '../core/gsap.js';

function getTransitionOverlay() {
  const wrap = document.querySelector('[data-transition-wrap]');

  return {
    wrap,
    dark: wrap?.querySelector('[data-transition-dark]')
  };
}

export const defaultTransition = {
  once() {
    return gsap.timeline();
  },

  leave({ current, reducedMotion }) {
    const tl = gsap.timeline();
    const { wrap, dark } = getTransitionOverlay();

    if (reducedMotion) {
      return tl.set(current, { autoAlpha: 0 });
    }

    if (wrap) {
      tl.set(wrap, {
        zIndex: 2
      });
    }

    if (dark) {
      tl.fromTo(
        dark,
        {
          autoAlpha: 0
        },
        {
          autoAlpha: 0.8,
          duration: 1.2,
          ease: 'parallax'
        },
        0
      );
    }

    tl.fromTo(
      current,
      {
        y: '0vh'
      },
      {
        y: '-25vh',
        duration: 1.2,
        ease: 'parallax'
      },
      0
    );

    if (dark) {
      tl.set(dark, {
        autoAlpha: 0
      });
    }

    return tl;
  },

  enter({ next, reducedMotion }) {
    const tl = gsap.timeline();

    if (reducedMotion) {
      return tl.set(next, { autoAlpha: 1 });
    }

    tl.set(next, {
      zIndex: 3
    });

    tl.fromTo(
      next,
      {
        y: '100vh'
      },
      {
        y: '0vh',
        duration: 1.2,
        ease: 'parallax'
      }
    );

    return tl;
  }
};
