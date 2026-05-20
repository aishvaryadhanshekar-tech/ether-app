export const primitiveColors = {
  brandPrimary: "#171717",
  brandPrimarySoft: "#F4F4F5",
  brandAccent: "#404040",
  neutral0: "#FFFFFF",
  neutral50: "#FAFAFA",
  neutral200: "#E5E5E5",
  neutral500: "#737373",
  neutral900: "#171717",
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
