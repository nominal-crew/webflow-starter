import { gsap } from '../core/gsap.js';

export function resetPage(container) {
  window.scrollTo(0, 0);

  gsap.set(container, {
    clearProps: 'position,top,left,right,z-index,transform'
  });
}
