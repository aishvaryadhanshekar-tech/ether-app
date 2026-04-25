import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

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

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SheetSide
}

const sideClassNameMap: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 border-b",
  right: "inset-y-0 right-0 h-full w-[90vw] max-w-sm border-l",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t",
  left: "inset-y-0 left-0 h-full w-[90vw] max-w-sm border-r",
}

export function SheetContent({
  side = "right",
  className,
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
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/45"
        onMouseDown={() => context.onOpenChange(false)}
        onTouchStart={() => context.onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed z-[1001] bg-white p-4 shadow-xl",
          sideClassNameMap[side],
          className,
        )}
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
