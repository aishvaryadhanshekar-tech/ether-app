import { useCallback, useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AdultProfileForm } from "@/modules/fees/rollover/components/AdultProfileForm"
import { ReviewAccordion } from "@/modules/fees/rollover/components/ReviewAccordion"
import type { AdultRole, RolloverFamily } from "@/modules/fees/rollover/types"
import { useRolloverFooter, useRolloverOutlet } from "@/modules/fees/rollover/useRolloverFooter"
import { useAppStore } from "@/store/rootStore"

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function RolloverParentScreen() {
  const { childId = "" } = useParams()
  const navigate = useNavigate()
  const family = useAppStore((state) => state.rolloverFamily)
  const updateRolloverAdult = useAppStore((state) => state.updateRolloverAdult)
  const restoreRolloverProgress = useAppStore((state) => state.restoreRolloverProgress)
  const { readOnly, requestNestedBack, setSectionGuard } = useRolloverOutlet()
  const [openIds, setOpenIds] = useState<Set<AdultRole>>(() => new Set(["father"]))
  const [snapshot] = useState<RolloverFamily>(() => cloneJson(useAppStore.getState().rolloverFamily))
  const hubPath = `/fees/rollover/${childId}`
  const isDirty = JSON.stringify(family) !== JSON.stringify(snapshot)

  const goHub = useCallback(() => {
    navigate(hubPath)
  }, [hubPath, navigate])

  const discard = useCallback(() => {
    const state = useAppStore.getState()
    restoreRolloverProgress(childId, {
      family: cloneJson(snapshot),
      childProfile: state.rolloverChildProfiles[childId],
      agreedDocIds: state.agreedDocIdsByChild[childId] ?? [],
      esignName: state.esignNameByChild[childId] ?? "",
    })
    navigate(hubPath)
  }, [childId, hubPath, navigate, restoreRolloverProgress, snapshot])

  useLayoutEffect(() => {
    setSectionGuard({
      isDirty,
      save: goHub,
      discard,
    })
    return () => setSectionGuard(null)
  }, [discard, goHub, isDirty, setSectionGuard])

  useRolloverFooter(
    readOnly ? (
      <button type="button" className="rollover-primary-btn" onClick={goHub}>
        Close
      </button>
    ) : (
      <>
        <button type="button" className="rollover-later-btn" onClick={requestNestedBack}>
          Back
        </button>
        <button type="button" className="rollover-primary-btn" disabled={!isDirty} onClick={goHub}>
          Save
        </button>
      </>
    ),
    [isDirty, readOnly, requestNestedBack],
  )

  function toggle(id: AdultRole) {
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="rollover-screen">
      <div className="rollover-stack">
        <ReviewAccordion
          title="Father’s Information"
          open={openIds.has("father")}
          onToggle={() => toggle("father")}
        >
          <AdultProfileForm
            idPrefix="father"
            profile={family.father}
            onChange={(patch) => updateRolloverAdult("father", patch)}
            readOnly={readOnly}
          />
        </ReviewAccordion>
        <ReviewAccordion
          title="Mother’s Information"
          open={openIds.has("mother")}
          onToggle={() => toggle("mother")}
        >
          <AdultProfileForm
            idPrefix="mother"
            profile={family.mother}
            onChange={(patch) => updateRolloverAdult("mother", patch)}
            readOnly={readOnly}
          />
        </ReviewAccordion>
        <ReviewAccordion
          title="Guardian’s Information"
          subtitle="(If applicable)"
          open={openIds.has("guardian")}
          onToggle={() => toggle("guardian")}
        >
          <AdultProfileForm
            idPrefix="guardian"
            profile={family.guardian}
            showRelationship
            onChange={(patch) => updateRolloverAdult("guardian", patch)}
            readOnly={readOnly}
          />
        </ReviewAccordion>
      </div>
    </section>
  )
}
