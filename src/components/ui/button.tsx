import { Button as ButtonPrimitive } from "@base-ui/react/button"
type UiButtonVariant = "default" | "ghost"
type UiButtonProps = Omit<ButtonPrimitive.Props, "className" | "style"> & {
  variant?: UiButtonVariant
}

function Button({
  variant = "default",
  ...props
}: UiButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className="ui-button"
      {...props}
    />
  )
}

export { Button }
