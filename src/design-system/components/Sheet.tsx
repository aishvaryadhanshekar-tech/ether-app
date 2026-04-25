import type { PropsWithChildren } from "react"

interface SheetProps extends PropsWithChildren {
  title: string
}

export function Sheet({ title, children }: SheetProps) {
  return (
    <aside className="info-sheet">
      <h3 className="info-sheet-title">{title}</h3>
      {children}
    </aside>
  )
}
