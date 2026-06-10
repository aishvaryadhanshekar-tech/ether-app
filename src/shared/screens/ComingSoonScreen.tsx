import { PageTitle } from "@/shared/components/PageTitle"

interface ComingSoonScreenProps {
  title: string
}

export function ComingSoonScreen({ title }: ComingSoonScreenProps) {
  return (
    <section className="coming-soon-screen">
      <PageTitle>{title}</PageTitle>
      <div className="coming-soon-panel">
        <p className="coming-soon-kicker">Coming soon</p>
        <h2 className="coming-soon-title">{title}</h2>
        <p className="coming-soon-copy">
          This module is being prepared and will be available in a future update.
        </p>
      </div>
    </section>
  )
}
