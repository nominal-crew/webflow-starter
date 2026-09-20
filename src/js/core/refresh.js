import { ScrollTrigger } from './gsap.js';
import { resizeLenis } from './lenis.js';

let webflowFirstLoad = true;

export function initRefresh() {
  resizeLenis();
  ScrollTrigger.refresh();
}

/**
 * Rebind Webflow's form handlers.
 *
 * Webflow binds them on full page load, which never happens again once Barba
 * swaps the container: the submit button stays locked and no AJAX handler is
 * attached, so submitting falls through to a native GET.
 *
 * Only the forms module is restarted. IX2 is deliberately left alone so
 * Webflow interactions are not replayed on every navigation.
 */
function resetWebflowForms() {
  const webflow = window.Webflow;
  if (!webflow) return;

  webflow.destroy();
  webflow.ready();

  const forms = webflow.require?.('forms');
  forms?.preview?.();

  document.querySelectorAll('.w-form').forEach((wrapper) => {
    wrapper.classList.remove('w-form-loading');

    wrapper.querySelectorAll('[type="submit"]').forEach((button) => {
      button.classList.remove('w-form-loading');
      button.removeAttribute('disabled');
    });
  });
}

/**
 * Re-render Cloudflare Turnstile widgets.
 *
 * The token issued on the previous page is stale after a Barba visit, so
 * submissions get rejected as spam. Each widget is torn down and rendered
 * again against the form's own sitekey.
 *
 * Turnstile only loads when Cloudflare sees a `data-turnstile-sitekey` in the
 * DOM, so every page needs at least one Webflow form. Add a hidden one to the
 * global footer if a page has none.
 */
function resetTurnstile() {
  if (!window.turnstile) return;

  document.querySelectorAll('.w-form form').forEach((form) => {
    const sitekey = form.getAttribute('data-turnstile-sitekey');
    if (!sitekey) return;

    form.querySelectorAll('[id^="cf-chl-widget"]').forEach((widget) => widget.remove());
    form.querySelectorAll('.cf-turnstile').forEach((widget) => widget.remove());

    const container = document.createElement('div');
    form.appendChild(container);

    window.turnstile.render(container, { sitekey });
  });
}

/**
 * Restore Webflow forms after a Barba visit.
 *
 * Skipped on the first load, where Webflow initialized itself normally.
 */
export function refreshWebflowForms() {
  if (webflowFirstLoad) {
    webflowFirstLoad = false;
    return;
  }

  requestAnimationFrame(() => {
    resetWebflowForms();
    resetTurnstile();
  });
}
