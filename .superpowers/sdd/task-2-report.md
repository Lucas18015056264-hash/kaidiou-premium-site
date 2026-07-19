# Task 2 Report: Rebalance card and case reading rhythm

## Changed files

- `src/styles/editorial-typography.test.ts`
  - Added assertions for product copy rhythm, case title tracking/line-height, case body sizing/line-height, and readable case eyebrow treatment.
- `src/styles/v2.css`
  - Set `.product-card p` line-height to `1.7`.
  - Set `.kdo-case-card h3` line-height to `1.24` and letter-spacing to `-0.015em`.
  - Set case body copy to `0.98rem` and `1.72` line-height.
  - Replaced the case eyebrow mono treatment with the body stack, `600` weight, and `0.04em` tracking.

No JSX, routes, content, media IDs, source links, enquiry behavior, focus treatment, or card boundaries were changed.

## Test evidence

- Red phase: `npm test -- --run src/styles/editorial-typography.test.ts` failed as expected with 1 failed test and 2 passed tests before CSS changes.
- Focused green phase: `npm test -- --run src/styles/editorial-typography.test.ts` passed, 3/3 tests.
- Full suite: `npm test` passed, 14 test files and 83 tests.

## Commit

- `Improve KDO card reading rhythm`

## Concerns

- None.
