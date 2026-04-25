import type { PropsWithChildren } from "react"

interface PageTitleProps extends PropsWithChildren {
  subtitle?: string
}

export function PageTitle({ subtitle, children }: PageTitleProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">{children}</h2>
      {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
    </div>
  )
}
