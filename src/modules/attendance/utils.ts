import dayjs from "dayjs"

export function sortByDateDescending<T extends { date: string }>(entries: T[]) {
  return [...entries].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
}
