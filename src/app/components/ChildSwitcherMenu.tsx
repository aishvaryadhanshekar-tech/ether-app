import { useEffect, useRef } from "react"
import type { KeyboardEvent, RefObject } from "react"
import { Check } from "lucide-react"
import { useActiveChild } from "@/shared/hooks/useActiveChild"
import {
  getChildAvatarFallback,
  getChildAvatarSrc,
  getChildGradeLabel,
} from "@/shared/utils/child"
import { useAppStore } from "@/store/rootStore"

interface ChildSwitcherMenuProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export function ChildSwitcherMenu({ isOpen, onClose, triggerRef }: ChildSwitcherMenuProps) {
  const { activeChildId, setActiveChild } = useActiveChild()
  const children = useAppStore((state) => state.children)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    menuRef.current
      ?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
      ?.focus()

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return
      }
      onClose()
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) {
    return null
  }

  function handleSelect(childId: string) {
    if (childId !== activeChildId) {
      setActiveChild(childId)
    }
    onClose()
    triggerRef.current?.focus()
  }

  function handleArrowKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return
    }
    event.preventDefault()
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
    )
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const step = event.key === "ArrowDown" ? 1 : -1
    items[(index + step + items.length) % items.length]?.focus()
  }

  return (
    <div
      ref={menuRef}
      className="child-switcher-menu"
      role="menu"
      aria-label="Switch child"
      onKeyDown={handleArrowKeys}
    >
      {Object.values(children).map((child) => {
        const isActive = child.id === activeChildId

        return (
          <button
            key={child.id}
            type="button"
            role="menuitemradio"
            aria-checked={isActive}
            className="child-switcher-item"
            data-active={isActive ? "true" : "false"}
            onClick={() => handleSelect(child.id)}
          >
            <img
              src={getChildAvatarSrc(child)}
              alt=""
              className="child-switcher-item-photo"
              onError={(event) => {
                event.currentTarget.src = getChildAvatarFallback(child.name)
              }}
            />
            <span className="child-switcher-item-info">
              <span className="child-switcher-item-name">{child.name}</span>
              <span className="child-switcher-item-grade">{getChildGradeLabel(child)}</span>
            </span>
            {isActive ? <Check className="child-switcher-item-check" aria-hidden /> : null}
          </button>
        )
      })}
    </div>
  )
}
