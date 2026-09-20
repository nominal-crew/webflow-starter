import { debounceOnWidthChange } from '../utils.js';
import { initRefresh } from './refresh.js';

export function initWindowEvents() {
  const debouncedRefresh = debounceOnWidthChange(initRefresh, 100);

  window.addEventListener('resize', debouncedRefresh);
  window.addEventListener('orientationchange', debouncedRefresh);
}
