import { type ReactNode, useCallback, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { RolloverProgressSnapshot } from "@/modules/fees/rollover/types"
import type { RolloverSectionGuard } from "@/modules/fees/rollover/useRolloverFooter"
import { useAppStore } from "@/store/rootStore"

const EMPTY_DOC_IDS: string[] = []

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function headerTitle(pathname: string, childId: string) {
  const base = `/fees/rollover/${childId}`
  if (pathname.endsWith("/parent")) {
    return "Parent details"
  }
  if (pathname.endsWith("/child")) {
    return "Child details"
  }
  if (pathname.includes("/declaration/")) {
    return "Declaration"
  }
  if (pathname === base || pathname === `${base}/`) {
    return ""
  }
  return "Rollover details"
}

export function RolloverLayout() {
  const { childId = "" } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [footer, setFooter] = useState<ReactNode>(null)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [sectionLeaveOpen, setSectionLeaveOpen] = useState(false)
  const sectionGuardRef = useRef<RolloverSectionGuard | null>(null)

  const family = useAppStore((state) => state.rolloverFamily)
  const childProfile = useAppStore((state) => state.rolloverChildProfiles[childId])
  const agreedDocIds = useAppStore(
    (state) => state.agreedDocIdsByChild[childId] ?? EMPTY_DOC_IDS,
  )
  const esignName = useAppStore((state) => state.esignNameByChild[childId] ?? "")
  const saveRolloverDraft = useAppStore((state) => state.saveRolloverDraft)
  const restoreRolloverProgress = useAppStore((state) => state.restoreRolloverProgress)
  const readOnly = useAppStore((state) => state.rolloverCompletedChildIds.includes(childId))
  const hubPath = `/fees/rollover/${childId}`
  const title = headerTitle(location.pathname, childId)
  const isDoc = location.pathname.includes("/declaration/")
  const isNestedPage =
    isDoc ||
    location.pathname.endsWith("/parent") ||
    location.pathname.endsWith("/child") ||
    location.pathname.endsWith("/declaration")

  const [snapshot] = useState<RolloverProgressSnapshot>(() => {
    const state = useAppStore.getState()
    const profile = state.rolloverChildProfiles[childId]
    return {
      family: cloneJson(state.rolloverFamily),
      childProfile: profile ? cloneJson(profile) : undefined,
      agreedDocIds: [...(state.agreedDocIdsByChild[childId] ?? [])],
      esignName: state.esignNameByChild[childId] ?? "",
    }
  })

  const isDirty =
    JSON.stringify({
      family,
      childProfile,
      agreedDocIds,
      esignName,
    }) !== JSON.stringify(snapshot)

  const setSectionGuard = useCallback((guard: RolloverSectionGuard | null) => {
    sectionGuardRef.current = guard
  }, [])

  const requestLeave = useCallback(() => {
    if (readOnly) {
      navigate("/fees")
      return
    }
    if (isDirty) {
      setLeaveOpen(true)
      return
    }
    setLeaveOpen(false)
    navigate("/fees")
  }, [isDirty, navigate, readOnly])

  const requestNestedBack = useCallback(() => {
    if (isDoc) {
      navigate(hubPath)
      return
    }
    const guard = sectionGuardRef.current
    if (guard?.isDirty) {
      setSectionLeaveOpen(true)
      return
    }
    navigate(hubPath)
  }, [hubPath, isDoc, navigate])

  function leaveToFees() {
    setLeaveOpen(false)
    navigate("/fees")
  }

  function handleBack() {
    if (isNestedPage) {
      requestNestedBack()
      return
    }

    requestLeave()
  }

  function handleDiscard() {
    restoreRolloverProgress(childId, snapshot)
    leaveToFees()
  }

  function handleSaveDraft() {
    saveRolloverDraft(childId)
    leaveToFees()
  }

  function handleSectionSave() {
    setSectionLeaveOpen(false)
    sectionGuardRef.current?.save()
  }

  function handleSectionDiscard() {
    setSectionLeaveOpen(false)
    sectionGuardRef.current?.discard()
  }

  return (
    <div className="app-layout-root">
      <div className="app-layout-shell rollover-sheet">
        <header className="rollover-sheet-header">
          <div className="rollover-sheet-header-row">
            <button type="button" className="rollover-back" onClick={handleBack} aria-label="Go back">
              <ArrowLeft aria-hidden />
            </button>
            {title ? <p className="rollover-sheet-kicker">{title}</p> : null}
          </div>
        </header>
        <main className="rollover-sheet-main">
          <Outlet context={{ setFooter, requestLeave, requestNestedBack, readOnly, setSectionGuard }} />
        </main>
        {footer ? <div className="rollover-sheet-footer">{footer}</div> : null}
      </div>

      <Sheet open={leaveOpen} onOpenChange={setLeaveOpen}>
        <SheetContent side="bottom" className="rollover-leave-sheet">
          <div className="attendance-sheet-grabber" />
          <div className="rollover-leave-header">
            <h3 className="rollover-leave-title">Save your progress?</h3>
            <p className="rollover-leave-copy">
              Save as a draft to finish later, or discard these changes.
            </p>
          </div>
          <div className="rollover-leave-actions">
            <button type="button" className="rollover-primary-btn" onClick={handleSaveDraft}>
              Save as draft
            </button>
            <button type="button" className="rollover-outline-btn" onClick={handleDiscard}>
              Discard changes
            </button>
            <button type="button" className="rollover-leave-dismiss" onClick={() => setLeaveOpen(false)}>
              Keep editing
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={sectionLeaveOpen} onOpenChange={setSectionLeaveOpen}>
        <SheetContent side="bottom" className="rollover-leave-sheet">
          <div className="attendance-sheet-grabber" />
          <div className="rollover-leave-header">
            <h3 className="rollover-leave-title">Save your progress?</h3>
            <p className="rollover-leave-copy">
              Save these edits, or discard them and return.
            </p>
          </div>
          <div className="rollover-leave-actions">
            <button type="button" className="rollover-primary-btn" onClick={handleSectionSave}>
              Save
            </button>
            <button type="button" className="rollover-outline-btn" onClick={handleSectionDiscard}>
              Discard changes
            </button>
            <button
              type="button"
              className="rollover-leave-dismiss"
              onClick={() => setSectionLeaveOpen(false)}
            >
              Keep editing
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
