import {
  Award,
  Building2,
  Calendar,
  FileText,
  LayoutGrid,
  Megaphone,
  Search,
  Users,
  X,
} from "lucide-react"
import { FilterDropdownChip } from "@/modules/connect/components/FilterDropdownChip"
import type {
  AnnouncementScopeFilter,
  AnnouncementTypeFilter,
} from "@/modules/connect/types"

interface AnnouncementFiltersProps {
  searchQuery: string
  typeFilter: AnnouncementTypeFilter
  scopeFilter: AnnouncementScopeFilter
  onSearchChange: (query: string) => void
  onTypeFilterChange: (filter: AnnouncementTypeFilter) => void
  onScopeFilterChange: (filter: AnnouncementScopeFilter) => void
}

const typeFilterItems = [
  { value: "all" as const, label: "All types", icon: <LayoutGrid /> },
  { value: "announcement" as const, label: "Announcements", icon: <Megaphone /> },
  { value: "kudos" as const, label: "Kudos", icon: <Award /> },
  { value: "circular" as const, label: "Circulars", icon: <FileText /> },
  { value: "event" as const, label: "Events", icon: <Calendar /> },
]

const scopeFilterItems = [
  { value: "all" as const, label: "All groups", icon: <LayoutGrid /> },
  { value: "school" as const, label: "School-wide", icon: <Building2 /> },
  { value: "class" as const, label: "Class groups", icon: <Users /> },
]

export function AnnouncementFilters({
  searchQuery,
  typeFilter,
  scopeFilter,
  onSearchChange,
  onTypeFilterChange,
  onScopeFilterChange,
}: AnnouncementFiltersProps) {
  return (
    <div className="announcement-filters">
      <label className="connect-search">
        <Search className="connect-search-icon" aria-hidden />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search announcements, circulars, events, kudos"
          className="connect-search-input"
          aria-label="Search announcements"
        />
        {searchQuery ? (
          <button
            type="button"
            className="connect-search-clear"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X className="connect-search-clear-icon" aria-hidden />
          </button>
        ) : null}
      </label>

      <div className="announcement-filter-chips">
        <FilterDropdownChip
          value={typeFilter}
          items={typeFilterItems}
          onChange={onTypeFilterChange}
          ariaLabel="Filter by announcement type"
        />
        <FilterDropdownChip
          value={scopeFilter}
          items={scopeFilterItems}
          onChange={onScopeFilterChange}
          ariaLabel="Filter by group scope"
        />
      </div>
    </div>
  )
}
