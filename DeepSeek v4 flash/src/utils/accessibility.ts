export const ARIA_LABELS = {
  cartIcon: 'Shopping cart',
  languageSwitcher: 'Switch language',
  search: 'Search products',
  closeMenu: 'Close menu',
  openMenu: 'Open menu',
  addToCart: 'Add to cart',
  removeItem: 'Remove item',
  quantityDecrease: 'Decrease quantity',
  quantityIncrease: 'Increase quantity',
  loading: 'Loading',
  carousel: 'Product images',
  previousImage: 'Previous image',
  nextImage: 'Next image',
  clearFilters: 'Clear all filters',
  proceedToCheckout: 'Proceed to checkout',
} as const;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocus(element: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;

  const focusableElements = element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusable) {
    event.preventDefault();
    lastFocusable.focus();
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    event.preventDefault();
    firstFocusable.focus();
  }
}

export function setInitialFocus(element: HTMLElement): void {
  const focusableElements = element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  } else {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
}

export function returnFocusToTrigger(triggerElement: HTMLElement | null): void {
  if (triggerElement) {
    triggerElement.focus();
  }
}

export const SkipToContent = `
  const SkipToContent = styled.a\`
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: 9999;

    &:focus {
      left: 1rem;
      top: 1rem;
      width: auto;
      height: auto;
      padding: \${({ theme }) => theme.spacing.sm} \${({ theme }) => theme.spacing.md};
      background-color: \${({ theme }) => theme.colors.emeraldGreen};
      color: \${({ theme }) => theme.colors.white};
      font-size: \${({ theme }) => theme.typography.fontSize.base};
      font-weight: \${({ theme }) => theme.typography.fontWeight.semibold};
      border-radius: 4px;
      text-decoration: none;
      outline: 2px solid \${({ theme }) => theme.colors.emeraldGreen};
      outline-offset: 2px;
    }
  \`;

  <SkipToContent href="#main-content">
    Skip to content
  </SkipToContent>
`;

export function getAltText(alt: string, altAr: string, language: string): string {
  return language === 'ar' ? altAr : alt;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) return null;

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);

  return { r, g, b };
}

export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 0;

  const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWcagAA(ratio: number, isLargeText: boolean = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}
