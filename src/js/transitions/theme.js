const themeConfig = {
  light: {
    nav: 'dark',
    transition: 'light'
  },

  dark: {
    nav: 'light',
    transition: 'dark'
  }
};

export function applyThemeFrom(container) {
  const pageTheme = container?.dataset?.pageTheme || 'light';
  const config = themeConfig[pageTheme] || themeConfig.light;

  document.body.dataset.pageTheme = pageTheme;

  const transitionElement = document.querySelector('[data-theme-transition]');
  if (transitionElement) {
    transitionElement.dataset.themeTransition = config.transition;
  }

  const nav = document.querySelector('[data-theme-nav]');
  if (nav) {
    nav.dataset.themeNav = config.nav;
  }
}
