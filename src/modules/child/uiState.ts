export type MyChildTab = "attendance" | "timetable" | "exams" | "badges" | "learn"

export interface MyChildUIState {
  activeTab: MyChildTab
  selectedDate?: string
  isBottomSheetOpen: boolean
  expandedExamId?: string
}
