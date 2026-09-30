# Fees per-child tabs — design

**Date:** 2026-08-14  
**Status:** Superseded by `2026-09-28-global-child-switcher-design.md`  
**Scope:** Fees & Payments screen only — split the household view into separate Aarav and Mira views

## Goal

Parents see each child’s fees independently. The summary cards, pay flow, and payment history all belong to the child selected on this screen — not a combined household total.

## Decisions

| Topic | Decision |
|---|---|
| Child switcher location | Tabs on the Fees screen only (Aarav \| Mira) |
| Tie to global `activeChildId` | No — Connect / My Child / header stay independent |
| Home Fees card | Unchanged (household `Payment due` if any child owes) |
| Cards under each tab | Same carousel: current term + upcoming term |
| Pay sheet | Selected child only; no sibling picker |
| Payment history | Follows the child tab; remove All / Aarav / Mira chips |
| Default tab | Aarav (`child_1`) |
| Seed / store shape | Unchanged (`childBalancesPaise` and breakdowns already keyed by child id) |

## Behavior

### Child tabs

- Place **Aarav | Mira** tabs under the page title `Fees & Payments`.
- Labels come from each child’s first name in the children store (`Aarav Mehta` → Aarav).
- Tab state lives on `FeesScreen` (`selectedChildId`). It does not call `setActiveChild`.
- Switching tabs updates cards, pay target, and history immediately.

### Summary cards

- Keep the existing two-slide carousel (current period, then upcoming).
- Amounts, paid vs due, and Pay Now / Pay early use only `selectedChildId`:
  - Current: `fees.childBalancesPaise[selectedChildId]`
  - Upcoming: `fees.upcoming.childBalancesPaise[selectedChildId]`
- Paid state is per child per card (`balance === 0`), not household total.
- Copy, pills, due dates, and reminder button stay as they are today, scoped to that child’s card.

### Pay Now / Pay early

- Opens the payment sheet for **that child and that period only**.
- No checkboxes or multi-select. Show that child’s outstanding breakdown and amount.
- Continue records a payment for `[selectedChildId]` via existing `recordFeePayment`.
- Success copy names that child only.
- If the child’s balance for that card is `0`, Pay stays hidden (paid card). Do not open the sheet.
- Switching the child tab closes any open pay, details, success, reminder, or receipt UI so the parent cannot complete an action for the previous child.

### Payment history

- `TransactionList` receives `childId={selectedChildId}` and shows `tx.childId === childId` only.
- Remove the All / Aarav / Mira chip bar.
- Keep term, category, and date filters. Resetting those filters does not change the child tab or reintroduce the other child’s transactions.

## Data

- Source: existing `useAppStore` `fees`, `transactions`, `children`.
- Children: `child_1` Aarav, `child_2` Mira (seed).
- `recordFeePayment` already accepts a child-id array; callers pass a single id.

## UI / files

**Touch:**

- `src/modules/fees/screens/FeesScreen.tsx` — tabs, per-child card math, pass one child into pay + history, close sheets on tab change.
- `src/modules/fees/components/PaymentSheet.tsx` — single-child layout; drop selection toggles.
- `src/modules/fees/components/TransactionList.tsx` — required `childId`; remove child filter chips and related state.
- `src/styles/globals.css` — Fees child tab bar (reuse existing Fees/Connect chip/tab language).

**Do not change:**

- Home screen Fees card
- Fee seed data / `FeeSummary` shape
- Reminder sheet, PDF receipt, payment details sheet (except they close on tab change)
- Global `activeChildId`

## Out of scope

- Per-child Home cards
- URL or route for selected child (`/fees?child=`)
- Paying both children in one transaction
- Changing due-date copy (`Due in 18 days`) or reminder scheduling
- New design-system primitives

## Success criteria

1. Default Fees view is Aarav: current and upcoming amounts match Aarav’s balances only.
2. Switching to Mira updates cards, pay, and history to Mira; Aarav’s balances are untouched.
3. Paying Aarav’s current (or upcoming) dues clears only Aarav for that period; Mira’s tab is unchanged.
4. History on Aarav’s tab never lists Mira’s receipts (and the reverse).
5. All / Aarav / Mira chips are gone from history.
6. Home Fees card still uses household outstanding.
7. Changing the Fees child tab does not change the header child or Connect / My Child.
