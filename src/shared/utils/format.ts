import dayjs from "dayjs"

export function formatDateLabel(value: string) {
  return dayjs(value).format("DD MMM YYYY")
}
