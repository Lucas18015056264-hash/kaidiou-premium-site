# Task 1 implementation report — Editorial typography hierarchy

## Changed files

- `src/styles/editorial-typography.test.ts` — added a CSS regression guard for the display token, body reading rhythm, and home-title hierarchy.
- `src/styles/tokens.css` — established the local Chinese-first display and body font stacks; raised the body token floor to `1rem`.
- `src/styles/global.css` — set body leading to `1.72` and display-heading leading/tracking to `1.12` / `-0.025em`.
- `src/styles/v2.css` — constrained and balanced the home H1 at `9.5ch` with `clamp(3rem, 5vw, 4.9rem)`.

## Red-green verification

1. Red: `npm test -- --run src/styles/editorial-typography.test.ts`
   - Expected failure observed: 2 failed tests. The existing display token did not start with `"DengXian"`, and the existing home H1 rule had neither `text-wrap: balance` nor the required scale.
2. Green: `npm test -- --run src/styles/editorial-typography.test.ts`
   - Passed: 1 test file, 2 tests.
3. Regression suite: `npm test`
   - Passed: 14 test files, 82 tests.

## Commit

- `7fbb558a5bf19e8bfd6d9c60f7e7245b9cf99bef` — `Refine KDO editorial typography hierarchy`

## Concern

- No remote font was added by design. Systems without DengXian fall back through PingFang SC and Microsoft YaHei UI, so final glyph metrics vary slightly by operating system while preserving the intended Chinese-first hierarchy.

## Responsive override follow-up

1. Expanded `editorial-typography.test.ts` before changing CSS. The regression guard now verifies the complete DengXian-first display stack, the `1rem` body-token floor, global H1/H2 tracking and `1.12` leading, desktop and mobile home-title constraints, and the homepage H2 leading.
2. Red: `npm test -- src/styles/editorial-typography.test.ts`
   - Expected failure observed. The mobile home title rule still set `max-width: 10.5ch` and `font-size: clamp(2.85rem, 12vw, 4.35rem)`.
3. Fixed the mobile title override to retain `9.5ch` and use `clamp(3rem, 10vw, 4.9rem)`, preserving the approved size range while allowing a responsive mobile interpolation.
4. Fixed the more-specific `.home-page h2` rule so its leading is explicitly `1.12`, matching the editorial heading hierarchy.
5. Green: `npm test -- src/styles/editorial-typography.test.ts`
   - Passed: 1 file, 2 tests.
6. Full regression: `npm test`
   - Passed: 14 files, 82 tests.

## Follow-up commit

- `Fix editorial typography responsive overrides`
