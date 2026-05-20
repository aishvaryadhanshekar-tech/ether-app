import { Button as ButtonPrimitive } from "@base-ui/react/button"
type UiButtonVariant = "default" | "secondary" | "ghost"
type UiButtonSize = "default" | "sm"
type UiButtonProps = Omit<ButtonPrimitive.Props, "className" | "style"> & {
  variant?: UiButtonVariant
  size?: UiButtonSize
}

function Button({
  variant = "default",
  size = "default",
  ...props
}: UiButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className="ui-button"
      {...props}
    />
  )
}

export { Button }
