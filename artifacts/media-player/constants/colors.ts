/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#f7f8ff',
    tint: '#61e7e8',

    // Core surfaces
    background: '#090b18',
    foreground: '#f7f8ff',

    // Cards / elevated surfaces
    card: '#14172b',
    cardForeground: '#f7f8ff',

    // Primary action color (buttons, links, active states)
    primary: '#61e7e8',
    primaryForeground: '#08131c',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#202542',
    secondaryForeground: '#f7f8ff',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#1b1f36',
    mutedForeground: '#9aa2c2',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#ff8066',
    accentForeground: '#160e18',

    // Destructive actions (delete, error states)
    destructive: '#ff5c78',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#292e4b',
    input: '#202542',
  },
  dark: {
    text: '#f7f8ff',
    tint: '#61e7e8',
    background: '#090b18',
    foreground: '#f7f8ff',
    card: '#14172b',
    cardForeground: '#f7f8ff',
    primary: '#61e7e8',
    primaryForeground: '#08131c',
    secondary: '#202542',
    secondaryForeground: '#f7f8ff',
    muted: '#1b1f36',
    mutedForeground: '#9aa2c2',
    accent: '#ff8066',
    accentForeground: '#160e18',
    destructive: '#ff5c78',
    destructiveForeground: '#ffffff',
    border: '#292e4b',
    input: '#202542',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
