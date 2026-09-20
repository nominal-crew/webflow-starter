import { mediaqueries } from './mediaqueries.js';

const mediaQuery = window.matchMedia(mediaqueries.isPrefersReducedMotion);
let reducedMotion = mediaQuery.matches;

function handleChange(event) {
  reducedMotion = event.matches;
}

mediaQuery.addEventListener?.('change', handleChange);
mediaQuery.addListener?.(handleChange);

export function prefersReducedMotion() {
  return reducedMotion;
}
