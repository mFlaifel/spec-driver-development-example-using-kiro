export const ANIMATIONS = {
  pageTransition: 'opacity 300ms ease-in-out',
  hover: 'transform 250ms ease-in-out, box-shadow 250ms ease-in-out',
  cartAdd: 'transform 200ms ease-out',
  mobileMenu: 'transform 350ms ease-in-out',
  spinner: 'rotate 800ms linear infinite',
  fadeIn: 'opacity 400ms ease-in-out',
  slideIn: 'transform 350ms ease-in-out',
};

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

export function isMobileViewport(): boolean {
  return window.innerWidth < BREAKPOINTS.mobile;
}

export function isTableViewport(): boolean {
  return window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet;
}

export function isDesktopViewport(): boolean {
  return window.innerWidth >= BREAKPOINTS.tablet;
}

export function getIconTransform(direction: string): string {
  return direction === 'rtl' ? 'scaleX(-1)' : 'scaleX(1)';
}

export const DEPLOYMENT_CONFIG = {
  buildDir: 'dist',
  environments: ['development', 'staging', 'production'],
  envPrefix: 'VITE_',
  requiredEnvVars: ['VITE_API_BASE_URL'],
};
