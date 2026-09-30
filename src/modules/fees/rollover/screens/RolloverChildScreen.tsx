import { useCallback, useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChildProfileForm } from "@/modules/fees/rollover/components/ChildProfileForm"
import { ReviewAccordion } from "@/modules/fees/rollover/components/ReviewAccordion"
import { ReviewField } from "@/modules/fees/rollover/components/ReviewField"
import { ReviewSelect } from "@/modules/fees/rollover/components/ReviewSelect"
import { BLOOD_GROUP_OPTIONS } from "@/modules/fees/rollover/constants"
import type { ChildRolloverProfile } from "@/modules/fees/rollover/types"
import { useRolloverFooter, useRolloverOutlet } from "@/modules/fees/rollover/useRolloverFooter"
import { getFirstName } from "@/modules/fees/utils"
import { useAppStore } from "@/store/rootStore"

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

type AccordionId = "info" | "health" | "mobile"

export function RolloverChildScreen() {
  const { childId = "" } = useParams()
  const navigate = useNavigate()
  const child = useAppStore((state) => state.children[childId])
  const profile = useAppStore((state) => state.rolloverChildProfiles[childId])
  const updateRolloverChildProfile = useAppStore((state) => state.updateRolloverChildProfile)
  const restoreRolloverProgress = useAppStore((state) => state.restoreRolloverProgress)
  const { readOnly, requestNestedBack, setSectionGuard } = useRolloverOutlet()
  const [openIds, setOpenIds] = useState<Set<AccordionId>>(() => new Set(["info"]))
  const [snapshot] = useState<ChildRolloverProfile | undefined>(() => {
    const current = useAppStore.getState().rolloverChildProfiles[childId]
    return current ? cloneJson(current) : undefined
  })
  const hubPath = `/fees/rollover/${childId}`
  const firstName = getFirstName(child?.name ?? profile?.name ?? "Student")
  const isDirty = JSON.stringify(profile) !== JSON.stringify(snapshot)

  const goHub = useCallback(() => {
    navigate(hubPath)
  }, [hubPath, navigate])

  const discard = useCallback(() => {
    if (!snapshot) {
      navigate(hubPath)
      return
    }
    const state = useAppStore.getState()
    restoreRolloverProgress(childId, {
      family: cloneJson(state.rolloverFamily),
      childProfile: cloneJson(snapshot),
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

  function toggle(id: AccordionId) {
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

  if (!profile) {
    return (
      <section className="rollover-screen">
        <p className="fees-loading">This child could not be found.</p>
      </section>
    )
  }

  return (
    <section className="rollover-screen">
      <div className="rollover-stack">
        <ReviewAccordion
          title={`${firstName} Information`}
          open={openIds.has("info")}
          onToggle={() => toggle("info")}
        >
          <ChildProfileForm
            idPrefix={childId}
            profile={profile}
            onChange={(patch) => updateRolloverChildProfile(childId, patch)}
            readOnly={readOnly}
          />
        </ReviewAccordion>
        <ReviewAccordion
          title={`${firstName} Health Information`}
          open={openIds.has("health")}
          onToggle={() => toggle("health")}
        >
          <div className="rollover-form-grid">
            <ReviewSelect
              id={`${childId}-health-blood`}
              label="Blood Group"
              value={profile.bloodGroup}
              options={BLOOD_GROUP_OPTIONS}
              placeholder="Select"
              onChange={(bloodGroup) => updateRolloverChildProfile(childId, { bloodGroup })}
              readOnly={readOnly}
            />
            <ReviewField
              id={`${childId}-allergies`}
              label="Allergies"
              value={profile.allergies}
              required={false}
              onChange={(allergies) => updateRolloverChildProfile(childId, { allergies })}
              readOnly={readOnly}
            />
            <ReviewField
              id={`${childId}-medical`}
              label="Medical Notes"
              value={profile.medicalNotes}
              required={false}
              multiline
              onChange={(medicalNotes) => updateRolloverChildProfile(childId, { medicalNotes })}
              readOnly={readOnly}
            />
          </div>
        </ReviewAccordion>
        <ReviewAccordion
          title="Primary Mobile Registered With School"
          open={openIds.has("mobile")}
          onToggle={() => toggle("mobile")}
        >
          <div className="rollover-form-grid">
            <ReviewField
              id={`${childId}-mobile`}
              label="Primary Mobile"
              value={profile.primaryMobile}
              onChange={(primaryMobile) => updateRolloverChildProfile(childId, { primaryMobile })}
              readOnly={readOnly}
            />
          </div>
        </ReviewAccordion>
      </div>
    </section>
  )
}
