// ─── Design System Tokens ──────────────────────────────────────────────────
// Single Source of Truth for all design tokens.
// Edit here → run `npm run tokens` → changes reflect in globals.css & Storybook.

export type DesignTokens = {
  colors: Record<string, string>
  sidebar: Record<string, string>
  radius: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, string>
}

export const tokens: DesignTokens = {
  colors: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",

    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",

    popover: "0 0% 100%",
    popoverForeground: "222.2 84% 4.9%",

    primary: "221.2 83.2% 53.3%",
    primaryForeground: "210 40% 98%",

    secondary: "210 40% 96.1%",
    secondaryForeground: "222.2 47.4% 11.2%",

    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",

    accent: "210 40% 96.1%",
    accentForeground: "222.2 47.4% 11.2%",

    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",

    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "221.2 83.2% 53.3%",

    // PayFlow brand colors
    success: "142.1 76.2% 36.3%",
    successForeground: "355.7 100% 97.3%",
    warning: "32.1 94.6% 43.7%",
    warningForeground: "210 40% 98%",
  },

  sidebar: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    primary: "221.2 83.2% 53.3%",
    primaryForeground: "210 40% 98%",
    accent: "217.2 32.6% 17.5%",
    accentForeground: "210 40% 98%",
    border: "217.2 32.6% 17.5%",
    ring: "221.2 83.2% 53.3%",
  },

  radius: {
    lg: "0.5rem",
    md: "calc(0.5rem - 2px)",
    sm: "calc(0.5rem - 4px)",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  typography: {
    fontSans: "var(--font-geist-sans)",
    fontMono: "var(--font-geist-mono)",
    sizeXs: "0.75rem",
    sizeSm: "0.875rem",
    sizeMd: "1rem",
    sizeLg: "1.125rem",
    sizeXl: "1.25rem",
    size2xl: "1.5rem",
    size3xl: "1.875rem",
    size4xl: "2.25rem",
    lineHeightNormal: "1.5",
    lineHeightTight: "1.25",
    weightNormal: "400",
    weightMedium: "500",
    weightSemibold: "600",
    weightBold: "700",
  },
}

export default tokens
