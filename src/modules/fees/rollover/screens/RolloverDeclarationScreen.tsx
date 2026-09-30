import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DECLARATION_DOCS } from "@/modules/fees/rollover/constants"
import { useRolloverFooter, useRolloverOutlet } from "@/modules/fees/rollover/useRolloverFooter"
import { useAppStore } from "@/store/rootStore"

const EMPTY_DOC_IDS: string[] = []

export function RolloverDeclarationScreen() {
  const { childId = "", docId = "" } = useParams()
  const navigate = useNavigate()
  const doc = DECLARATION_DOCS.find((item) => item.id === docId)
  const agreeRolloverDeclaration = useAppStore((state) => state.agreeRolloverDeclaration)
  const agreedDocIds = useAppStore(
    (state) => state.agreedDocIdsByChild[childId] ?? EMPTY_DOC_IDS,
  )
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const listPath = `/fees/rollover/${childId}`
  const { readOnly } = useRolloverOutlet()
  const locked = agreedDocIds.includes(docId) || readOnly

  useEffect(() => {
    const el = endRef.current
    if (!el) {
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setHasReachedEnd(true)
        observer.disconnect()
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [docId])

  function handleConfirm() {
    if (!confirmed || !doc) {
      return
    }
    agreeRolloverDeclaration(childId, doc.id)
    navigate(listPath)
  }

  useRolloverFooter(
    locked ? (
      <button type="button" className="rollover-primary-btn" onClick={() => navigate(listPath)}>
        Close
      </button>
    ) : (
      <div className="rollover-doc-actions">
        <button type="button" className="rollover-outline-btn" onClick={() => navigate(listPath)}>
          Cancel
        </button>
        <button
          type="button"
          className="rollover-primary-btn rollover-doc-agree"
          disabled={!confirmed}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    ),
    [listPath, confirmed, locked, navigate],
  )

  if (!doc) {
    return (
      <section className="rollover-screen">
        <p className="fees-loading">This document could not be found.</p>
      </section>
    )
  }

  return (
    <section className="rollover-screen">
      <div className="rollover-doc-article">
        <h3 className="rollover-doc-heading">{doc.title}</h3>
        {doc.body.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="rollover-doc-paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      <div ref={endRef} className="rollover-doc-end" aria-hidden />

      {locked ? (
        <label className="rollover-doc-consent" data-enabled="true">
          <input type="checkbox" checked disabled readOnly />
          <span>You agreed to this declaration.</span>
        </label>
      ) : (
        <>
          <label className="rollover-doc-consent" data-enabled={hasReachedEnd ? "true" : "false"}>
            <input
              type="checkbox"
              checked={confirmed}
              disabled={!hasReachedEnd}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>I have read and agree to {doc.title}.</span>
          </label>
          {hasReachedEnd ? null : (
            <p className="rollover-doc-scroll-hint">
              Scroll to the end of the document to confirm.
            </p>
          )}
        </>
      )}
    </section>
  )
}
