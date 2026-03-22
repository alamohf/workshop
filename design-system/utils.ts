/**
 * Converts camelCase token key to CSS custom property name.
 * e.g. "cardForeground" → "--card-foreground"
 */
export function tokenKeyToCssVar(key: string): string {
  return (
    "--" +
    key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
  )
}

/**
 * Converts sidebar key to sidebar CSS custom property name.
 * e.g. "primary" → "--sidebar-primary"
 */
export function sidebarKeyToCssVar(key: string): string {
  return (
    "--sidebar-" +
    key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
  )
}
