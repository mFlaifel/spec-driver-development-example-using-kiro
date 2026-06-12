import { createGlobalStyle } from 'styled-components';
import type { Theme } from '../utils/theme';
import { isMobile, isTablet, isDesktop } from '../utils/media';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.direction === 'rtl' ? theme.typography.fontFamily.arabic : theme.typography.fontFamily.english};
    direction: ${({ theme }) => theme.direction};
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.darkNavy};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :root {
    --color-dark-navy: ${({ theme }) => theme.colors.darkNavy};
    --color-white: ${({ theme }) => theme.colors.white};
    --color-emerald-green: ${({ theme }) => theme.colors.emeraldGreen};
    --color-success: ${({ theme }) => theme.colors.semantic.success};
    --color-error: ${({ theme }) => theme.colors.semantic.error};
    --color-warning: ${({ theme }) => theme.colors.semantic.warning};
    --color-info: ${({ theme }) => theme.colors.semantic.info};
    --neutral-50: ${({ theme }) => theme.colors.neutral[50]};
    --neutral-100: ${({ theme }) => theme.colors.neutral[100]};
    --neutral-200: ${({ theme }) => theme.colors.neutral[200]};
    --neutral-300: ${({ theme }) => theme.colors.neutral[300]};
    --neutral-400: ${({ theme }) => theme.colors.neutral[400]};
    --neutral-500: ${({ theme }) => theme.colors.neutral[500]};
    --neutral-600: ${({ theme }) => theme.colors.neutral[600]};
    --neutral-700: ${({ theme }) => theme.colors.neutral[700]};
    --neutral-800: ${({ theme }) => theme.colors.neutral[800]};
    --neutral-900: ${({ theme }) => theme.colors.neutral[900]};
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  [dir="rtl"] {
    direction: rtl;
  }

  [dir="ltr"] {
    direction: ltr;
  }
`;

export { isMobile, isTablet, isDesktop };
export default GlobalStyles;
