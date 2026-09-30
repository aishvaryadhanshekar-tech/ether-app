import { useMemo } from "react"
import { Check, ChevronRight, User, Users } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { DECLARATION_DOCS } from "@/modules/fees/rollover/constants"
import { useRolloverFooter, useRolloverOutlet } from "@/modules/fees/rollover/useRolloverFooter"
import { getFirstName } from "@/modules/fees/utils"
import { useAppStore } from "@/store/rootStore"

const EMPTY_DOC_IDS: string[] = []

export function RolloverDetailsScreen() {
  const { childId = "" } = useParams()
  const navigate = useNavigate()
  const child = useAppStore((state) => state.children[childId])
  const profile = useAppStore((state) => state.rolloverChildProfiles[childId])
  const agreedDocIds = useAppStore(
    (state) => state.agreedDocIdsByChild[childId] ?? EMPTY_DOC_IDS,
  )
  const esignName = useAppStore((state) => state.esignNameByChild[childId] ?? "")
  const completeRollover = useAppStore((state) => state.completeRollover)
  const setRolloverEsignName = useAppStore((state) => state.setRolloverEsignName)
  const { requestLeave, readOnly } = useRolloverOutlet()
  const firstName = getFirstName(child?.name ?? profile?.name ?? "Student")
  const declarationComplete = useMemo(
    () => DECLARATION_DOCS.every((doc) => agreedDocIds.includes(doc.id)) && esignName.trim().length > 0,
    [agreedDocIds, esignName],
  )
  const hubPath = `/fees/rollover/${childId}`

  function handleComplete() {
    if (!declarationComplete) {
      return
    }
    completeRollover(childId)
    navigate("/fees")
  }

  useRolloverFooter(
    readOnly ? (
      <button type="button" className="rollover-primary-btn" onClick={() => navigate("/fees")}>
        Close
      </button>
    ) : (
      <>
        <button type="button" className="rollover-later-btn" onClick={requestLeave}>
          Cancel
        </button>
        <button
          type="button"
          className="rollover-primary-btn"
          disabled={!declarationComplete}
          onClick={handleComplete}
        >
          Finish rollover
        </button>
      </>
    ),
    [declarationComplete, readOnly, requestLeave],
  )

  if (!child || !profile) {
    return (
      <section className="rollover-screen">
        <p className="fees-loading">This child could not be found.</p>
      </section>
    )
  }

  return (
    <section className="rollover-screen">
      <div className="rollover-hub-intro">
        <h1 className="rollover-hub-title">Rollover details</h1>
        <p className="rollover-hub-copy">
          Parent and child details are optional. Declaration on this page is required to finish.
        </p>
      </div>

      <div className="rollover-hub-list">
        <button
          type="button"
          className="rollover-hub-card"
          onClick={() => navigate(`${hubPath}/parent`)}
        >
          <span className="rollover-hub-icon" aria-hidden>
            <Users size={20} />
          </span>
          <span className="rollover-hub-card-copy">
            <span className="rollover-hub-card-title">Parent details</span>
            <span className="rollover-hub-card-sub">
              Review father, mother, and guardian information.
            </span>
          </span>
          <ChevronRight className="rollover-hub-chevron" aria-hidden />
        </button>

        <button
          type="button"
          className="rollover-hub-card"
          onClick={() => navigate(`${hubPath}/child`)}
        >
          <span className="rollover-hub-icon" aria-hidden>
            <User size={20} />
          </span>
          <span className="rollover-hub-card-copy">
            <span className="rollover-hub-card-title">Child details</span>
            <span className="rollover-hub-card-sub">
              Review personal, health, and contact details for {firstName}.
            </span>
          </span>
          <ChevronRight className="rollover-hub-chevron" aria-hidden />
        </button>
      </div>

      <div className="rollover-declarations-card">
        <h3 className="rollover-declarations-title">
          Declaration
          <span className="rollover-required-badge">Required</span>
        </h3>
        <p className="rollover-declarations-copy">
          {readOnly
            ? "Submitted declarations. Open a document to read it again."
            : "Open each document, read it, and confirm at the end of it. You must agree to all documents and esign to finish rollover."}
        </p>

        <ul className="rollover-doc-list">
          {DECLARATION_DOCS.map((doc) => {
            const agreed = agreedDocIds.includes(doc.id)
            return (
              <li key={doc.id} className="rollover-doc-row" data-agreed={agreed ? "true" : "false"}>
                <Link
                  className="rollover-doc-open"
                  to={`/fees/rollover/${childId}/declaration/${doc.id}`}
                  aria-label={agreed ? `${doc.title} — agreed` : doc.title}
                >
                  <span className="rollover-doc-link-text">{doc.title}</span>
                  {agreed ? (
                    <span className="rollover-doc-status" aria-hidden>
                      <Check size={12} />
                      Agreed
                    </span>
                  ) : null}
                  <ChevronRight className="rollover-doc-chevron" aria-hidden />
                </Link>
              </li>
            )
          })}
        </ul>

        {readOnly ? null : (
          <p className="rollover-declarations-fineprint">
            By agreeing, you confirm that all the information provided is true and correct.
          </p>
        )}

        <label className="rollover-esign" htmlFor={`${childId}-esign`}>
          <span className="rollover-esign-label">Esign</span>
          <input
            id={`${childId}-esign`}
            className="rollover-field-input"
            value={esignName}
            placeholder="Enter your name"
            readOnly={readOnly}
            disabled={readOnly}
            onChange={(event) => setRolloverEsignName(childId, event.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
