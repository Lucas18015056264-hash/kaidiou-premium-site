# Editorial Typography Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cramped industrial type and equal-weight card layout with an accessible editorial system for a KDO materials brand.

**Architecture:** This is a CSS-token and layout treatment change. `tokens.css` owns families and scales, `global.css` owns reading hierarchy, and `v2.css` owns home, case, product and responsive treatments. A CSS-source regression test protects the intended type treatment.

**Tech Stack:** React 19, TypeScript, Vite, plain CSS custom properties, Vitest, Playwright.

## Global Constraints

- Do not add runtime font dependencies or remote font loading.
- Keep real case media, source links, semantics, routes and enquiry behavior.
- Keep body text at 16px or larger and preserve visible keyboard focus.
- Use green only as a navigation/action cue.
- Validate desktop, tablet, 390px mobile, reduced motion and no horizontal overflow.

---

### Task 1: Establish editorial type tokens and hero hierarchy

**Files:**
- Create: `src/styles/editorial-typography.test.ts`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/styles/v2.css`

- [ ] Write a failing Vitest source test that reads the three CSS files and expects:

```ts
expect(tokens).toContain('--font-display: "DengXian"');
expect(globalCss).toContain('line-height: 1.72');
expect(homeHeroRule).toContain('text-wrap: balance');
expect(homeHeroRule).toContain('font-size: clamp(3rem, 5vw, 4.9rem)');
```

- [ ] Run `npm test -- --run src/styles/editorial-typography.test.ts` and verify the expected failure: current display starts with Bahnschrift, body line-height is 1.6, and the hero has no balanced title rule.
- [ ] Implement the smallest matching CSS change: use `DengXian`, `PingFang SC`, and `Microsoft YaHei UI` for display; set body line-height 1.72; give H1/H2 1.12 line-height; set `.kdo-home-hero h1` to `max-width: 9.5ch`, `font-size: clamp(3rem, 5vw, 4.9rem)`, and `text-wrap: balance`.
- [ ] Re-run the focused test and commit with `git commit -m "Refine KDO editorial typography hierarchy"`.

### Task 2: Rebalance card and case reading rhythm

**Files:**
- Modify: `src/styles/editorial-typography.test.ts`
- Modify: `src/styles/global.css`
- Modify: `src/styles/v2.css`

- [ ] Extend the focused test with these assertions:

```ts
expect(caseTitleRule).toContain('line-height: 1.24');
expect(caseBodyRule).toContain('font-size: 0.98rem');
expect(productBodyRule).toContain('line-height: 1.7');
```

- [ ] Run the focused test and verify it fails because existing card text is tighter and smaller.
- [ ] Add the minimal editorial treatment: product body line-height 1.7; case H3 line-height 1.24 with restrained tracking; case body at 0.98rem / 1.72; eyebrow labels in the readable body family, 600 weight, and 0.04em tracking.
- [ ] Re-run the focused test and commit with `git commit -m "Improve KDO card reading rhythm"`.

### Task 3: Verify and publish

**Files:**
- Modify only if checks expose a defect.

- [ ] Run `npm test`, then run the Pages build with `VITE_BASE_PATH='/kaidiou-premium-site/'` and `VITE_SITE_URL='https://Lucas18015056264-hash.github.io'`.
- [ ] Run `npm run test:e2e`; all desktop/tablet/mobile checks, focus behavior, images, overflow and console checks must pass.
- [ ] Use Playwright CLI screenshots at 1280x720 and 390x844 to inspect the hero and case section. Desktop must have balanced title lines; mobile must not have character-by-character title wrapping or horizontal overflow.
- [ ] Commit all implementation files, push `main`, copy the verified `dist` build to the verified `gh-pages` worktree, push `gh-pages`, then inspect the public URL.
