/* ------------------------------------------------------------------- */
/* Timing & Performance                                                */
/* ------------------------------------------------------------------- */

export function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function debounceOnWidthChange(fn, ms) {
  let lastWidth = window.innerWidth;
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

export const throttle = (fn, wait = 300) => {
  let lastTime = 0;

  return (...args) => {
    const now = Date.now();

    if (now - lastTime >= wait) {
      fn(...args);
      lastTime = now;
    }
  };
};

export function delay(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------- */
/* String Helpers                                                      */
/* ------------------------------------------------------------------- */

export function toKebabCase(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/--+/g, '-')
    .toLowerCase()
    .trim();
}

/* ------------------------------------------------------------------- */
/* Array Helpers                                                       */
/* ------------------------------------------------------------------- */

export function shuffleArray(array) {
  const arr = array.slice();

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/* ------------------------------------------------------------------- */
/* Math & Units                                                        */
/* ------------------------------------------------------------------- */

export function pxToRem(px) {
  const fs = getComputedStyle(document.documentElement).fontSize;
  return px / parseFloat(fs);
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const lerp = (start, end, t) => start * (1 - t) + end * t;
