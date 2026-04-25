import { colors } from "@/design-system/tokens/colors"

export const cssThemeVars = {
  "--color-primary": colors.primary,
  "--color-success": colors.success,
  "--color-warning": colors.warning,
  "--color-danger": colors.danger,
  "--color-muted": colors.muted,
  "--color-surface": colors.surface,
  "--color-foreground": colors.foreground,
  "--color-border": colors.border,
} as const
