import * as React from "react"

function Card({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card"
      className="ui-card"
      {...props}
    />
  )
}

function CardHeader({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card-header"
      className="ui-card-header"
      {...props}
    />
  )
}

function CardTitle({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card-title"
      className="ui-card-title"
      {...props}
    />
  )
}

function CardDescription({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card-description"
      className="ui-card-description"
      {...props}
    />
  )
}

function CardAction({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card-action"
      className="ui-card-action"
      {...props}
    />
  )
}

function CardContent({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card-content"
      className="ui-card-content"
      {...props}
    />
  )
}

function CardFooter({ ...props }: Omit<React.ComponentProps<"div">, "className" | "style">) {
  return (
    <div
      data-slot="card-footer"
      className="ui-card-footer"
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
