export const isMobile = (first: TemplateStringsArray, ...args: unknown[]) =>
  `@media (max-width: 767px) { ${String.raw(first, ...args)} }`;

export const isTablet = (first: TemplateStringsArray, ...args: unknown[]) =>
  `@media (min-width: 768px) and (max-width: 1023px) { ${String.raw(first, ...args)} }`;

export const isDesktop = (first: TemplateStringsArray, ...args: unknown[]) =>
  `@media (min-width: 1024px) { ${String.raw(first, ...args)} }`;
