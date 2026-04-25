import * as React from "react"
import { createPortal } from "react-dom"

type SheetSide = "top" | "right" | "bottom" | "left"

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onOpenChange, open])

  React.useEffect(() => {
    if (!open) {
      return
    }

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  return <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>
}

interface SheetContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "style"> {
  side?: SheetSide
}

const sideClassNameMap: Record<SheetSide, string> = {
  top: "sheet-content-top",
  right: "sheet-content-right",
  bottom: "sheet-content-bottom",
  left: "sheet-content-left",
}

export function SheetContent({
  side = "right",
  children,
  ...props
}: SheetContentProps) {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error("SheetContent must be used inside Sheet")
  }

  if (!context.open) {
    return null
  }

  return createPortal(
    <div className="sheet-root">
      <div
        className="sheet-backdrop"
        onMouseDown={() => context.onOpenChange(false)}
        onTouchStart={() => context.onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`sheet-content ${sideClassNameMap[side]}`}
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
