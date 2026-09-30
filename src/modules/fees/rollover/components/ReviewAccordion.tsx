import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

interface ReviewAccordionProps {
  title: string
  subtitle?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export function ReviewAccordion({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: ReviewAccordionProps) {
  return (
    <div className="rollover-accordion" data-open={open ? "true" : "false"}>
      <button type="button" className="rollover-accordion-trigger" onClick={onToggle}>
        <span className="rollover-accordion-copy">
          <span className="rollover-accordion-title">{title}</span>
          {subtitle ? <span className="rollover-accordion-subtitle">{subtitle}</span> : null}
        </span>
        <ChevronDown className="rollover-accordion-chevron" data-open={open ? "true" : "false"} aria-hidden />
      </button>
      {open ? <div className="rollover-accordion-body">{children}</div> : null}
    </div>
  )
}
