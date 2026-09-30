# Ether — Parent App (prototype)

Mobile-first web prototype of a school **parent app**. The parent (Rajesh Mehta) has two children, **Aarav Mehta** (`child_1`, Grade 6-A) and **Mira Mehta** (`child_2`, Grade 3-C). The app covers attendance, timetable, exams, badges, fees and payments (INR), a re-enrolment "rollover" flow, and school messaging ("Connect").

There is **no backend**. All data is generated client-side at startup and held in memory in a Zustand store. A page reload resets everything.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build  (type errors fail the build)
npm run lint     # eslint
npm run preview
```

There is no test suite. Check changes with `npm run build` and `npm run lint`, and by running the app. Deployment is on Vercel as an SPA (`vercel.json` sends every route to `index.html`).

## Stack

- React 19, TypeScript ~6 (strict unused locals/params, `verbatimModuleSyntax`, so use `import type` for types), Vite 8
- react-router-dom v7 (`createBrowserRouter`)
- Zustand v5, one root store built from slices
- Tailwind CSS v4 (via `@tailwindcss/postcss`), shadcn (`base-nova` style, `@base-ui/react`), `tw-animate-css`
- `lucide-react` for all icons, `dayjs` for dates
- Path alias: `@/` → `src/`

## Directory layout

```
src/
  main.tsx, App.tsx          # App = <AppProviders><AppRouter/></AppProviders>
  app/
    router.tsx               # all routes
    layout.tsx               # AppLayout: header (logo + active child), <Outlet/>, BottomNav
    providers.tsx            # runs seedApp() on mount
    bottomNav.ts, components/BottomNav.tsx
  store/
    rootStore.ts             # useAppStore = context + attendance + exams + fees + timetable slices
    contextStore.ts          # activeChildId, children, timetable, results, badges, learnSession
  db/
    schema.ts                # SeedSchema type
    generators.ts            # deterministic-ish mock data (generateSeedData)
    seed.ts                  # seedApp(): writes the seed into the store (runs once)
  services/                  # fake async APIs over the store (simulateDelay ~250ms)
  modules/<feature>/
    screens/  components/  store.ts  selectors.ts  types.ts  utils.ts  index.ts
  shared/                    # PageTitle, ComingSoonScreen, useActiveChild, format utils
  components/ui/             # shadcn-style primitives (sheet, card, button, textarea)
  design-system/             # tokens (colors/spacing/typography), Button, Card, Sheet wrappers
  styles/globals.css         # THE stylesheet (~2600 lines): tokens + all component classes
docs/superpowers/specs/      # dated design specs for features
public/images/               # local assets (e.g. aarav-mehta.png)
```

`src/index.css` and `src/App.css` are leftovers from the Vite template and are not imported. Only `styles/globals.css` is loaded (from `main.tsx`).

## Routes

| Path | Screen |
|---|---|
| `/` | redirects to `/my-child` |
| `/home` | `HomeScreen`: wireframe placeholder cards plus a real "Fees & Payments" entry card |
| `/my-child/{attendance,timetable,exams,badges,learn}` | `MyChildScreen` with `SectionTabs`; the tab comes from the route via `initialTab` |
| `/fees` | `FeesScreen`: per-child tabs, fee cards, pay flow, history, receipts |
| `/connect` | `ConnectScreen`: announcements and group chats (static mock data) |
| `/add`, `/profile` | `ComingSoonScreen` |
| `/fees/rollover/:childId` | `RolloverLayout` (full-screen, **outside** AppLayout, no bottom nav) → details hub, `parent`, `child`, `declaration/:docId` |

Bottom nav tabs: Home, My Child, Add, Connect, Profile (`app/bottomNav.ts`).

## State and data flow

- **Single store**: `useAppStore` in `store/rootStore.ts`. Each feature slice is a `StateCreator<AppStore, [], [], XSlice>` in `modules/<feature>/store.ts`, spread into the root. When you add a slice, add it to both the `AppStore` type and the `create()` call.
- **Data is keyed by child id**: `attendance[childId]`, `exams[childId]`, `badges[childId]`, `fees.childBalancesPaise[childId]`, and so on.
- **Seeding**: `AppProviders` → `seedApp()` → `generateSeedData()`. It sets children, timetable, badges, fees and transactions directly, and seeds attendance and exams through `attendanceService.seed` / `examsService.seed`. A module-level `hasSeeded` flag guards it.
- **Selectors**: hooks in `modules/<feature>/selectors.ts` (e.g. `useAttendanceEntries`, `useBadges`). Use module-level `EMPTY_*` constant arrays as `?? fallback` inside selectors so Zustand doesn't see a new reference on every render. Derive with `useMemo`. Keep pure `getX(entries)` functions next to their `useX(childId)` hooks.
- **Services** (`services/*.service.ts`) wrap store access in fake async calls. They exist to mimic an API layer.
- **Active child**: `useActiveChild()` → `activeChildId` (defaults to `child_1`). It drives the header, My Child and Connect. **Fees keeps its own `feesSelectedChildId`** and deliberately does not call `setActiveChild` (see `docs/superpowers/specs/2026-08-14-fees-per-child-tabs-design.md`).

## Feature notes

### Attendance (`modules/attendance`)
A month calendar (`getCalendarMatrix`, weeks start Monday), a summary (present/absent/late), anomalies (absent/late, capped at 5, with unresolved absences that have no note listed first), and a bottom sheet for adding an absence note (`updateAttendanceNote`). Statuses: `present | absent | late | holiday | weekend | not_marked`. Future, weekend, holiday and out-of-month cells are disabled.

### Timetable, Exams, Badges, Learn
- Timetable has day and week views, period and break rows, a period details sheet and `print.ts`.
- Exams have upcoming and results toggles and a details sheet.
- Badges show cards and a details sheet. Only Aarav has badges.
- Learn is a placeholder.

### Fees (`modules/fees`), the largest feature
- **All money is in integer paise** (`amountPaise`). Format only with `formatFeeAmount` (INR, `en-IN`). Never store rupees as floats.
- `FeeSummary` holds the current term (`termLabel`, `dueDate`, `childBalancesPaise`, `outstandingBreakdown`, `termBreakdown`) plus `upcoming`. `termBreakdown` is the original fee structure and is **never mutated by payments**. `outstandingBreakdown` is reduced proportionally.
- `recordFeePayment(childIds, amountPaise, method, target, isInstallment)` allocates the payment across children, splits it pro-rata across categories (the last line absorbs rounding), creates `PaymentTransaction`s with a fake receipt number, and tracks installment plans (`installmentStartedKeys` as `"childId:current"`, second installment due at +60 days).
- Sheet flow on `FeesScreen`: PaymentSheet → PaymentGatewaySheet → PaymentSuccessSheet. There are also FeeBreakdownSheet, PaymentDetailsSheet, PdfReceiptModal, ReminderScheduleSheet and TransactionList. `#payment-history` in the URL scrolls to history.
- **Rollover** (`fees/rollover`) is annual re-enrolment per child. It covers parent details (father/mother/guardian `AdultProfile`), child details (`ChildRolloverProfile`), declaration documents (`DECLARATION_DOCS`, each agreed separately) and an e-sign name.
  - `RolloverLayout` snapshots progress on entry, computes `isDirty`, and asks for "Save as draft / Discard / Keep editing" on leave.
  - Child screens get `{ setFooter, requestLeave, requestNestedBack, readOnly, setSectionGuard }` through Outlet context. Use `useRolloverOutlet()` / `useRolloverFooter(node, deps)`.
  - A completed child (`rolloverCompletedChildIds`) is read-only.
  - The Home fees card shows "Rollover pending" until every child has completed rollover. After that it shows "Payment due" if any balance is left.

### Connect (`modules/connect`)
Announcements (kinds: announcement/kudos/circular/event; scopes: school/class; filter chips) and group conversations (messages of kind text/image/document/video/voice/…, members, shared files). Data is static in `data/mockConnectData.ts` and is not in the store. `ConnectScreen.tsx` is large (~900 lines) and handles list, chat and info views internally.

## Styling conventions (important)

- **Semantic CSS classes, not inline Tailwind utilities.** Components use BEM-ish class names prefixed with the feature name (`fees-*`, `rollover-*`, `attendance-*`, `calendar-*`, `timetable-*`, `connect-*`, `home-*`, `sheet-*`, `app-layout-*`, `bottom-nav-*`). Those classes are defined in `src/styles/globals.css` inside `@layer components`, mostly with `@apply`. Add new styles there, grouped with the feature's existing block. Don't scatter utility classes through JSX.
- State goes into data attributes (`data-active="true"`) or modifier classes (`home-fees-description-due`, `calendar-cell-status-absent`).
- **Tokens**: primitive → semantic CSS variables on `:root` (neutral/wireframe palette: `#171717` primary, plus success `#16a34a`, warning `#f59e0b`, danger `#dc2626`). A `.dark` override exists. Use the token-backed Tailwind colors (`text-muted-foreground`, `border-border`, `bg-card`, `text-warning`…) rather than hard-coded hex.
- The look is intentionally **neutral and monochrome, wireframe-like**. Colour is reserved for status (green present/paid, amber late/due, red absent/overdue).
- The layout is a phone-width shell (`app-layout-shell`) with a sticky header and bottom nav.
- **Bottom sheets**: use `Sheet` / `SheetContent side="bottom"` from `@/components/ui/sheet`. It is a custom portal implementation with Escape-to-close, backdrop click and body scroll lock. Add a `<div className="attendance-sheet-grabber" />` handle at the top to match other sheets.
- Icons: `lucide-react` only, with `aria-hidden` on decorative icons.

## Working preferences

- **When reworking UI, keep established icons, copy and styles, and change only what was asked.** Reuse existing components and CSS patterns before inventing new ones.
- Before building a sizeable feature, write a short design spec in `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` (Goal, a Decisions table, Behavior, Scope) and match the style of the existing specs.
- Code style: 2-space indent, double quotes, no semicolons, named exports for components (`export function FooScreen()`), and one component per file in `components/` or `screens/`.
- Accessibility: meaningful `aria-label`s on icon-only buttons and links, `role="dialog"` on sheets, and AA-readable disabled states (no whole-element opacity on text).
- Mock data should look realistic and Indian-school specific (INR, Grades, Terms such as "Term 2 2026-2027", Aadhaar/PAN fields).
