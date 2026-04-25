export const primitiveColors = {
  brandPrimary: "#4F46E5",
  brandPrimarySoft: "#EEF2FF",
  brandAccent: "#AA3BFF",
  neutral0: "#FFFFFF",
  neutral50: "#F8FAFC",
  neutral200: "#E5E7EB",
  neutral500: "#6B7280",
  neutral900: "#111827",
  success600: "#16A34A",
  warning500: "#F59E0B",
  danger600: "#DC2626",
} as const

export const semanticColors = {
  primary: primitiveColors.brandPrimary,
  success: primitiveColors.success600,
  warning: primitiveColors.warning500,
  danger: primitiveColors.danger600,
  muted: primitiveColors.neutral500,
  surface: primitiveColors.neutral0,
  foreground: primitiveColors.neutral900,
  border: primitiveColors.neutral200,
} as const

export const colors = semanticColors
