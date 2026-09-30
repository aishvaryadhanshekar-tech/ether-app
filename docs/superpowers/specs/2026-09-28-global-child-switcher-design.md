# Global child switcher — design

**Date:** 2026-09-28  
**Status:** Implemented  
**Scope:** App header + Fees & Payments. Replaces the Fees per-child tabs (`2026-08-14-fees-per-child-tabs-design.md`).

## Goal

Every module shows one child at a time. The parent switches child from the profile in the app header, and My Child, Connect and Fees all follow that choice. Fees no longer has its own Aarav | Mira tabs.

## Decisions

| Topic | Decision |
|---|---|
| Switcher location | App header profile (name, grade, photo of the active child only), tappable |
| Scope | Global: sets `activeChildId`; Fees reads it |
| Fees child tabs | Removed, along with `feesSelectedChildId` / `setFeesSelectedChildId` |
| Picker | Dropdown anchored under the header profile: photo, name, grade, check on active child |
| Affordance | Small chevron; flips while the dropdown is open |
| Fee / rollover status in picker | None; keep the picker minimal |
| Switch feedback | None beyond the header updating |
| Open Fees sheets on switch | Closed. The Fees body is keyed by child id, so sheet and history-filter state resets |
| After rollover completes | `completeRollover` sets `activeChildId` to that child |
| Home Fees card | Unchanged (household status) |

## Behavior

### Header

- The profile block is a `<button aria-haspopup="menu" aria-expanded>` labelled "Switch child, currently viewing {name}".
- With only one child the button is disabled and has no chevron.

### Dropdown

- `role="menu"` with one `menuitemradio` per child (`aria-checked` on the active one).
- On open, focus moves to the active child. ArrowUp and ArrowDown move between children.
- Tapping another child sets it active and closes the menu. Tapping the active child just closes it.
- A tap outside or Escape closes it. Escape and selection return focus to the header button.

### Fees

- The page shows the active child's summary or rollover card, enrolment card and payment history. Otherwise it is unchanged from the 08-14 behaviour.

## Files

- `src/app/layout.tsx`: header switcher button and dropdown anchor
- `src/app/components/ChildSwitcherMenu.tsx`: new
- `src/shared/utils/child.ts`: `getChildGradeLabel`, `getChildAvatarSrc`, `getChildAvatarFallback`
- `src/modules/fees/screens/FeesScreen.tsx`: tabs removed, follows `activeChildId`
- `src/modules/fees/store.ts`: `feesSelectedChildId` removed
- `src/styles/globals.css`: `app-layout-profile-*`, `child-switcher-*`; `fees-child-tab*` removed

## Out of scope

- Tried and removed as too crowded: sibling peek avatar, amber attention dot, bottom-sheet picker with fee status lines, "Now viewing" toast
- Swipe-to-switch on the header
- Remembering the active child across reloads
- Per-child Home cards
