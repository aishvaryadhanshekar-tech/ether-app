# Home Fees & Payments card — design

**Date:** 2026-08-04  
**Status:** Approved in conversation; awaiting implementation plan  
**Scope:** Home screen `Fees & Payments` entry card only

## Goal

Make the home Fees & Payments card signal when action is needed (outstanding balance), without showing the amount, and without creating new components.

## Decisions

| Topic | Decision |
|---|---|
| Outstanding second line | `Payment due` |
| Clear second line | `View payment details` |
| Amount on card | Never shown |
| Highlight | Amber/gold dot on icon when outstanding |
| Approach | Inline updates on existing `HomeScreen` card + CSS |
| New components | None |

## Behavior

### Outstanding (`hasOutstanding === true`)

- Small amber/gold **dot** at the top-right of the existing icon container (reference layout only; match existing warning/amber tokens).
- Title remains `Fees & Payments`.
- Second line: `Payment due`, styled with warning/amber color; optional Lucide `Clock` ahead of the text to match the reference feel.
- Chevron / arrow remains; **no amount**.

### Clear (`hasOutstanding === false`)

- **No** dot.
- Second line: `View payment details` (neutral description style, same as today’s muted subtitle).
- Chevron / arrow remains; **no amount**.

### Navigation

- Card remains a link to `/fees` (existing `Link`).

## Data

- Source: `useAppStore((state) => state.fees)` — same fees slice used by Fees screen.
- Rule:

```ts
const hasOutstanding = Object.values(fees?.childBalancesPaise ?? {}).some(
  (balance) => balance > 0,
)
```

- If `fees` is `null`, treat as clear (no dot, `View payment details`).

## UI / files

**Touch only:**

- `src/modules/home/screens/HomeScreen.tsx` — read store, conditional copy + conditional dot markup on the existing card.
- `src/styles/globals.css` — add styles for the icon wrapper relative positioning, the status dot, and outstanding subtitle color (reuse `--warning-500` / amber utilities already in the design system).

**Reuse (do not create):**

- Existing `home-fees-*` card structure and classes
- Lucide `CreditCard`, navigation arrow, and `Clock` if used
- Fees store / `childBalancesPaise`

## Out of scope

- Fees screen layout, payment flows, sheets
- Showing due date countdown (`Due in X days`)
- Showing amount on the home card
- New components or new shadcn primitives
- Accessibility beyond: keep a clear `aria-label` that reflects outstanding vs clear state

## Success criteria

1. With seeded outstanding balances, home card shows amber dot + `Payment due`, no amount.
2. After balances are cleared (or zero), card shows no dot + `View payment details`.
3. Card still navigates to `/fees`.
4. No new component files added.
