export function once({ container, data }) {
  // Project-specific functions that run once.
}

export function beforeEnter({ container, data }) {
  // Project-specific functions that run before enter animation.
}

export function afterEnter({ container, data }) {
  // Project-specific functions that run after enter animation.
  //
  // Example:
  // if (container.querySelector("[data-slider]")) {
  //   initSlider(container);
  // }
}
