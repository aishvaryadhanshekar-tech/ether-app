import { useEffect, useState } from "react"
import { BadgeCard } from "@/modules/badges/components/BadgeCard"
import { BadgeDetailsSheet } from "@/modules/badges/components/BadgeDetailsSheet"
import { useBadges } from "@/modules/badges/selectors"
import { badgesService } from "@/services/badges.service"
import type { Badge } from "@/modules/badges/types"

interface BadgesScreenProps {
  childId: string
}

export function BadgesScreen({ childId }: BadgesScreenProps) {
  const badges = useBadges(childId)
  const [loading, setLoading] = useState(false)
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null)
  const selectedBadge = badges.find((badge) => badge.id === selectedBadgeId) ?? null

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await badgesService.getByChild(childId)
      setLoading(false)
    }

    void load()
  }, [childId])

  function handleSelectBadge(badge: Badge) {
    setSelectedBadgeId(badge.id)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSelectedBadgeId(null)
    }
  }

  return (
    <section className="badges-section">
      {loading ? <p className="badges-loading">Loading...</p> : null}

      {badges.length === 0 ? (
        <div className="badges-empty-state">
          <div className="badges-empty-state-icon" aria-hidden="true">🏅</div>
          <p className="badges-empty-state-copy">No badges yet — they&apos;re on their way!</p>
        </div>
      ) : (
        <div className="badges-list">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onSelectBadge={handleSelectBadge} />
          ))}
        </div>
      )}

      <BadgeDetailsSheet
        badge={selectedBadge}
        isOpen={selectedBadge !== null}
        onOpenChange={handleOpenChange}
      />
    </section>
  )
}
