export interface Theme {
  direction: 'ltr' | 'rtl';
  colors: {
    darkNavy: string;
    white: string;
    emeraldGreen: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray600: string;
    gray900: string;
  };
  typography: {
    fontFamily: {
      en: string;
      ar: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}
