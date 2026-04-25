import { ExamsPanel } from "@/modules/exams/components/ExamsPanel"

interface ExamsScreenProps {
  childId: string
}

export function ExamsScreen({ childId }: ExamsScreenProps) {
  return <ExamsPanel childId={childId} />
}
