import type { Child } from "@/modules/child/types"

export function getChildGradeLabel(child: Child | undefined) {
  if (!child) {
    return "Loading child profile..."
  }
  return child.class.toLowerCase().startsWith("grade")
    ? `${child.class}-${child.section}`
    : `Grade ${child.class}-${child.section}`
}

export function getChildAvatarFallback(name: string | undefined) {
  const avatarName = encodeURIComponent(name ?? "Student")
  return `https://ui-avatars.com/api/?name=${avatarName}&background=F4F4F5&color=171717&size=128&bold=true`
}

export function getChildAvatarSrc(child: Child | undefined) {
  return child?.photoUrl ?? getChildAvatarFallback(child?.name)
}
