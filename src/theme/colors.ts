export const colors = {
  // --- Core Brand Colors ---
  // Primary color used for main UI elements like app bars and buttons
  primary: {
    main: '#002991',
    light: '#60CDFF', // A lighter variant for hover states or secondary elements
    dark: '#002169',  // A darker variant for status bars or pressed states
  },
  // Secondary color for accents, floating action buttons, and interactive elements
  secondary: {
    main: '#009CDE',
    light: '#63D0FF',
    dark: '#006DAA',
  },
  // NEW: Tertiary color for additional accents or distinct features
  tertiary: {
    main: '#F97316',   // A warm, contrasting orange
    light: '#FB923C',
    dark: '#C2410C',
  },

  // --- UI & Surface Colors ---
  // The default color that appears behind all scrollable content
  background: {
    default: '#F5F7FA', // Using your greyLight as the main background
  },
  // The color for surfaces of components like cards, sheets, and menus
  surface: {
    main: '#FFFFFF', // Surfaces are typically pure white
  },

  // --- Text & Icon Colors ---
  // Colors for text and icons placed "on top of" the key colors above
  text: {
    onPrimary: '#FFFFFF',      // Text on primary color
    onSecondary: '#FFFFFF',     // Text on secondary color
    onError: '#FFFFFF',         // Text on error color
    onBackground: '#1C2633',    // Text on background color (your soft black)
    onSurface: '#1C2633',       // Text on surface color
    onSurfaceSecondary: '#6C7378', // Secondary text (your greyDark)
  },

  // --- Feedback & Status Colors ---
  // Custom status colors for feedback messages, alerts, etc.
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6', // NEW: For informational alerts
  },

  // --- Utility Colors ---
  // Divider and outline colors
  divider: '#CBD2D6', // Your grey color
  // NEW: A full grayscale palette for more nuanced UI design
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // NEW: Common colors for explicit use
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
  // NEW: Colors for component states like 'disabled'
  action: {
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    disabledText: 'rgba(0, 0, 0, 0.38)',
  },
};