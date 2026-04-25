import { semanticColors } from "@/design-system/tokens/colors"
import { typography } from "@/design-system/tokens/typography"

export const cssThemeVars = {
  "--color-primary": semanticColors.primary,
  "--color-success": semanticColors.success,
  "--color-warning": semanticColors.warning,
  "--color-danger": semanticColors.danger,
  "--color-muted": semanticColors.muted,
  "--color-surface": semanticColors.surface,
  "--color-foreground": semanticColors.foreground,
  "--color-border": semanticColors.border,
  "--font-app-sans": typography.fontFamily.sans,
  "--font-app-heading": typography.fontFamily.heading,
} as const
