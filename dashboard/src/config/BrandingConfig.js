// SentraTech Branding Configuration for Admin Dashboard

export const BrandColors = {
  // Primary Colors - Neon Green Theme
  PRIMARY: '#00FF41',
  PRIMARY_LIGHT: '#33ff66',
  PRIMARY_DARK: '#00cc34',
  
  // Accent Colors
  ACCENT: '#00FF41',
  ACCENT_LIGHT: '#33ff66',
  ACCENT_DARK: '#00cc34',
  
  // SentraTech Green (from website)
  SENTRA_GREEN: '#00FF41',
  SENTRA_GREEN_HOVER: '#00e83a',
  
  // Status Colors
  SUCCESS: '#00FF41',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#00FF41',
  
  // Neutral Colors - Dark Theme (matching your image)
  BACKGROUND_DARK: '#0a0a0a',
  SURFACE_DARK: '#111111',
  CARD_DARK: '#1a1a1a',
  BORDER_DARK: '#333333',
  TEXT_PRIMARY_DARK: '#ffffff',
  TEXT_SECONDARY_DARK: '#cccccc',
  TEXT_MUTED_DARK: '#888888',
  
  // Neutral Colors - Light Theme  
  BACKGROUND_LIGHT: '#ffffff',
  SURFACE_LIGHT: '#f8fafc',
  CARD_LIGHT: '#ffffff', 
  BORDER_LIGHT: '#e5e7eb',
  TEXT_PRIMARY_LIGHT: '#111827',
  TEXT_SECONDARY_LIGHT: '#4b5563',
  TEXT_MUTED_LIGHT: '#6b7280',
};

export const Typography = {
  FONT_FAMILY: 'Inter, system-ui, -apple-system, sans-serif',
  FONT_WEIGHTS: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  FONT_SIZES: {
    xs: '0.75rem',
    sm: '0.875rem', 
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  }
};

export const Spacing = {
  GRID_SIZE: 8, // 8px grid system
  SIZES: {
    xs: '4px',
    sm: '8px',
    md: '16px', 
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  }
};

export const BorderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px'
};

export const Shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const Animations = {
  TRANSITIONS: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out', 
    slow: '500ms ease-in-out'
  },
  EASING: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
};

// Theme configurations
export const DarkTheme = {
  colors: {
    primary: BrandColors.PRIMARY,
    accent: BrandColors.ACCENT,
    success: BrandColors.SUCCESS,
    warning: BrandColors.WARNING,
    error: BrandColors.ERROR,
    info: BrandColors.INFO,
    background: BrandColors.BACKGROUND_DARK,
    surface: BrandColors.SURFACE_DARK,
    card: BrandColors.CARD_DARK,
    border: BrandColors.BORDER_DARK,
    textPrimary: BrandColors.TEXT_PRIMARY_DARK,
    textSecondary: BrandColors.TEXT_SECONDARY_DARK,
    textMuted: BrandColors.TEXT_MUTED_DARK
  }
};

export const LightTheme = {
  colors: {
    primary: BrandColors.PRIMARY,
    accent: BrandColors.ACCENT, 
    success: BrandColors.SUCCESS,
    warning: BrandColors.WARNING,
    error: BrandColors.ERROR,
    info: BrandColors.INFO,
    background: BrandColors.BACKGROUND_LIGHT,
    surface: BrandColors.SURFACE_LIGHT,
    card: BrandColors.CARD_LIGHT,
    border: BrandColors.BORDER_LIGHT,
    textPrimary: BrandColors.TEXT_PRIMARY_LIGHT,
    textSecondary: BrandColors.TEXT_SECONDARY_LIGHT,
    textMuted: BrandColors.TEXT_MUTED_LIGHT
  }
};

export const ComponentStyles = {
  SIDEBAR_WIDTH: '280px',
  HEADER_HEIGHT: '64px',
  CARD_PADDING: '24px',
  BUTTON_HEIGHT: {
    sm: '32px',
    md: '40px', 
    lg: '48px'
  },
  INPUT_HEIGHT: {
    sm: '36px',
    md: '44px',
    lg: '52px'
  }
};

export default {
  BrandColors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animations,
  DarkTheme,
  LightTheme,
  ComponentStyles
};