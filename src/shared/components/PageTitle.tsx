import type { PropsWithChildren } from "react"

interface PageTitleProps extends PropsWithChildren {
  subtitle?: string
}

export function PageTitle({ subtitle, children }: PageTitleProps) {
  return (
    <div className="page-title">
      <h2 className="page-title-heading">{children}</h2>
      {subtitle ? <p className="page-title-subtitle">{subtitle}</p> : null}
    </div>
  )
}
