export const mediaqueries = {
  isMobile: '(max-width: 479px)',
  isMobileLandscape: '(max-width: 767px)',
  isTablet: '(max-width: 991px)',
  isDesktop: '(min-width: 992px)',
  isPrefersReducedMotion: '(prefers-reduced-motion: reduce)'
};

mediaqueries.getCurrent = () => {
  return Object.entries(mediaqueries)
    .filter(([, value]) => typeof value === 'string')
    .filter(([, query]) => window.matchMedia(query).matches)
    .map(([key]) => key);
};
