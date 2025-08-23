export const colors = {
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
  // The default color that appears behind all scrollable content
  background: {
    default: '#F5F7FA', // Using your greyLight as the main background
  },
  // The color for surfaces of components like cards, sheets, and menus
  surface: {
    main: '#FFFFFF', // Surfaces are typically pure white
  },
  // Colors for text and icons placed "on top of" the key colors above
  text: {
    onPrimary: '#FFFFFF',    // Text on primary color
    onSecondary: '#FFFFFF',   // Text on secondary color
    onError: '#FFFFFF',       // Text on error color
    onBackground: '#1C2633',  // Text on background color (your soft black)
    onSurface: '#1C2633',     // Text on surface color
    onSurfaceSecondary: '#6C7378', // Secondary text (your greyDark)
  },
  // Custom status colors for non-error feedback
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  // Divider and outline colors
  divider: '#CBD2D6', // Your grey color
};
