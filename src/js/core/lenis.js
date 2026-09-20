import Lenis from 'lenis';

import { config } from './config.js';
import { gsap, ScrollTrigger } from './gsap.js';

export let lenis = null;

export function initLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: config.lenis.lerp,
    wheelMultiplier: config.lenis.wheelMultiplier
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function stopLenis() {
  lenis?.stop();
}

export function startLenis() {
  lenis?.resize?.();
  lenis?.start?.();
}

export function resizeLenis() {
  lenis?.resize();
}
