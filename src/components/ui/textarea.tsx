import * as React from "react"

function Textarea({ ...props }: Omit<React.ComponentProps<"textarea">, "className" | "style">) {
  return (
    <textarea
      data-slot="textarea"
      className="ui-textarea"
      {...props}
    />
  )
}

export { Textarea }
