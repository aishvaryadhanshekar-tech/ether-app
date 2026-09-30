# Fees card "Review & Pay" — design

**Date:** 2026-09-26  
**Status:** Implemented  
**Scope:** Fees summary card (after rollover) and the payment review sheet

## Goal

The fees card shows only what is due and when. The fee breakdown moves off the card and into the L1 bottom sheet the CTA opens. Parents always see what they are paying for before they continue to the gateway.

## Decisions

| Topic | Decision |
|---|---|
| Breakdown on the card | Removed in every state (due, upcoming, paid) |
| Separate `FeeBreakdownSheet` | Deleted |
| CTA copy | "Review & Pay"; installment pending: "Review & pay early" |
| Sheet order | Payment plan → Student / Term → Fee breakdown |
| Breakdown format | Flat list of 6 line items, always expanded, no group headers |
| Sheet layout | Fixed header, scrolling middle, sticky footer ("Paying now" + Cancel / Continue to pay) |
| Seed data | 6 line items per child; term totals unchanged (Aarav ₹20,000, Mira ₹14,500) |

## Behavior

### Card

- Shows the child and year, the status pill, "Amount due · by <date>", the amount, the CTA and the reminder bell.
- Paid state shows the amount and "Your fees for this period are fully settled." with no breakdown link.

### Review payment sheet

- The payment plan (Pay in full / Pay in 2 installments) sits at the top and appears only when a split is still possible.
- The review card lists Student and Term.
- Fee breakdown lists every line item flat (flattened from `termBreakdown` groups). It is followed by Term total, Paid (when partly paid) and Total due / Remaining.
- The footer stays pinned: "Paying now" updates with the selected plan, above Cancel and Continue to pay.

## Scope

- In: `FeesScreen`, `PaymentSheet`, `FeeBreakdownList`, fees seed line items, fees CSS.
- Out: Home fees card, gateway / success / receipt sheets, rollover, payment allocation.
