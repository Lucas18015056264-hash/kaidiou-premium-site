# 凯迪欧高端官网 V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将第一版概念型官网升级为带完整图片、产品深页、公司事实、购买方式和中英采购路径的高端对外官网。

**Architecture:** 保留现有 React/Vite 路由与双语内容模型，在其上增加可追溯的媒体清单、采购内容模型和复用型视觉组件。新版样式独立放入 `v2.css` 并在现有样式后加载；页面数据继续集中维护，但企业事实与采购流程单独拆分，避免让现有 `site-content.ts` 继续无限增长。

**Tech Stack:** React 19、React Router 7、TypeScript 5.9、Vite 7、Vitest、Testing Library、Playwright、CSS、WebP。

## Global Constraints

- AI 图片只作为材料或环境概念视觉，不能冒充真实案例、工厂或管理者照片。
- 负责人、联系方式、公司主体、年份、产能、出口、客户、资质与性能数字只发布可核验信息。
- 五个产品详情页必须包含独立主视觉、应用、选型、施工流程、资料交接与采购入口。
- 所有中英文深链、语言切换、404、查询参数和直接刷新必须保持可用。
- 当前询盘表单无后端，提交前必须明确提示不会发送数据。
- 所有新增交互支持键盘、可见焦点、减弱动画和 WCAG AA 对比度。

---

## File Map

- Create `src/app/company-content.ts`: 已核验企业信息、采购路径、流程与负责人可见性规则。
- Create `src/app/media-content.ts`: 所有网站图片、来源、替代文本和用途的唯一清单。
- Create `src/components/MediaFigure.tsx`: 统一输出图片尺寸、来源属性、说明和懒加载策略。
- Create `src/components/PurchasePanel.tsx`: 产品、行业和首页复用的三类采购入口。
- Create `src/pages/PurchasePage.tsx`: 工程询价、样板、经销和海外采购页面。
- Create `src/styles/v2.css`: V2 页面与组件样式，后于 `global.css` 加载。
- Create `IMAGE-PROMPTS.md`: AI 场景图片最终提示词、用途和真实性约束。
- Modify `src/app/site-content.ts`: 丰富产品视觉、选型、流程和 FAQ 字段。
- Modify `src/app/App.tsx`: 注册 `/buy` 与 `/en/buy`，维护 SEO 和 404 行为。
- Modify `src/pages/HomePage.tsx`: 材料色谱首页与购买流程。
- Modify `src/pages/ProductsPage.tsx`: 图片化产品目录。
- Modify `src/pages/ProductDetailPage.tsx`: 五个产品完整深页。
- Modify `src/pages/SolutionsPage.tsx`: 场景图片、推荐产品与锚点详情。
- Modify `src/pages/AboutPage.tsx`: 企业事实、主体关系、发展节点与负责人区域。
- Modify `src/pages/ContactPage.tsx`: 采购类型、联系渠道和表单说明。
- Modify `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`: 增加购买入口与完整站点导航。
- Modify `src/main.tsx`: 加载 `v2.css`。
- Modify existing unit and E2E tests under `src/**/*.test.tsx` and `tests/e2e/site.spec.ts`.

---

### Task 1: 建立可追溯媒体模型与网站资产

**Files:**
- Create: `src/app/media-content.ts`
- Create: `src/components/MediaFigure.tsx`
- Create: `src/components/MediaFigure.test.tsx`
- Create: `IMAGE-PROMPTS.md`
- Create: `public/media/v2/*.webp`

**Interfaces:**
- Produces: `SiteMedia`, `MediaId`, `siteMedia`, `getMedia(id)` and `<MediaFigure mediaId priority className />`.
- Consumes: 企业 PDF 中已授权图片、内置图像生成输出和 `Locale`。

- [ ] **Step 1: Write the failing provenance and rendering tests**

```tsx
render(<MediaFigure mediaId="product-marking" locale="zh" />);
const image = screen.getByRole('img', { name: '纳米硅标线涂料应用概念图' });
expect(image).toHaveAttribute('src', '/media/v2/product-marking.webp');
expect(image).toHaveAttribute('data-media-provenance', 'concept-visual');
expect(image).toHaveAttribute('width');
expect(image).toHaveAttribute('height');
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/components/MediaFigure.test.tsx`

Expected: FAIL because `MediaFigure` and `media-content.ts` do not exist.

- [ ] **Step 3: Build the typed media manifest and component**

```ts
export type MediaProvenance = 'company-material' | 'concept-visual' | 'verified-case';
export type SiteMedia = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  provenance: MediaProvenance;
};
```

Generate or select one hero, five product, four solution and one material-lab image. Convert selected company images and generated outputs to WebP, keep source files outside `public`, and record each final prompt in `IMAGE-PROMPTS.md`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- src/components/MediaFigure.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add outputs/kaidiou-premium-site/src/app/media-content.ts outputs/kaidiou-premium-site/src/components/MediaFigure.tsx outputs/kaidiou-premium-site/src/components/MediaFigure.test.tsx outputs/kaidiou-premium-site/public/media/v2 outputs/kaidiou-premium-site/IMAGE-PROMPTS.md
git commit -m "feat: add traceable premium media library"
```

### Task 2: 增加企业事实与采购内容模型

**Files:**
- Create: `src/app/company-content.ts`
- Create: `src/app/company-content.test.ts`
- Modify: `src/app/site-content.ts`
- Modify: `src/app/site-content.test.ts`

**Interfaces:**
- Produces: `companyProfileByLocale`, `purchasePathsByLocale`, `purchaseStepsByLocale`, `contactChannels`.
- Extends: `Product` with `code`, `mediaId`, `selectionQuestions`, `systemLayers`, `applicationSteps`, `faq`, and `purchaseKinds`.

- [ ] **Step 1: Write failing content-contract tests**

```ts
for (const locale of ['zh', 'en'] as const) {
  expect(contentByLocale[locale].products).toHaveLength(5);
  for (const product of contentByLocale[locale].products) {
    expect(product.mediaId).toBeTruthy();
    expect(product.selectionQuestions.length).toBeGreaterThanOrEqual(3);
    expect(product.applicationSteps.length).toBeGreaterThanOrEqual(4);
    expect(product.purchaseKinds).toContain('project-quote');
  }
}
expect(companyProfileByLocale.zh.leader?.verified).not.toBe(false);
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/app/site-content.test.ts src/app/company-content.test.ts`

Expected: FAIL because the richer fields and company module do not exist.

- [ ] **Step 3: Implement evidence-safe content**

Use the research report and enterprise PDFs. If the leader cannot be verified, set `leader: null` and render the management section as a team philosophy without a person. Never create a fake portrait or name.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- src/app/site-content.test.ts src/app/company-content.test.ts`

Expected: PASS in both locales.

- [ ] **Step 5: Commit**

```bash
git add outputs/kaidiou-premium-site/src/app/company-content.ts outputs/kaidiou-premium-site/src/app/company-content.test.ts outputs/kaidiou-premium-site/src/app/site-content.ts outputs/kaidiou-premium-site/src/app/site-content.test.ts
git commit -m "feat: add verified company and procurement content"
```

### Task 3: 建立购买页与复用采购入口

**Files:**
- Create: `src/components/PurchasePanel.tsx`
- Create: `src/components/PurchasePanel.test.tsx`
- Create: `src/pages/PurchasePage.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`

**Interfaces:**
- Produces: `<PurchasePanel locale productSlug compact />` and `<PurchasePage locale />`.
- Route contract: `/buy?type=project-quote&product=<slug>` and `/en/buy?...`.

- [ ] **Step 1: Write failing route and CTA tests**

```tsx
window.history.pushState({}, '', '/buy?type=sample');
render(<App />);
expect(screen.getByRole('heading', { level: 1, name: '选择适合你的采购方式' })).toBeVisible();
expect(screen.getByRole('link', { name: '申请颜色样板' })).toHaveAttribute('href', '/contact?request=sample');
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/app/App.test.tsx src/components/PurchasePanel.test.tsx`

Expected: FAIL because `/buy` and the component are missing.

- [ ] **Step 3: Implement routes, purchase page and navigation**

Render four purchase paths, five purchase steps, prepared information lists and direct handoff to the existing form. Preserve query parameters during language switching.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test -- src/app/App.test.tsx src/components/PurchasePanel.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add outputs/kaidiou-premium-site/src/components/PurchasePanel.tsx outputs/kaidiou-premium-site/src/components/PurchasePanel.test.tsx outputs/kaidiou-premium-site/src/pages/PurchasePage.tsx outputs/kaidiou-premium-site/src/app/App.tsx outputs/kaidiou-premium-site/src/app/App.test.tsx outputs/kaidiou-premium-site/src/components/SiteHeader.tsx outputs/kaidiou-premium-site/src/components/SiteFooter.tsx
git commit -m "feat: add complete purchasing journeys"
```

### Task 4: 重做首页与产品目录

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/ProductsPage.tsx`
- Modify: `src/pages/content-pages.test.tsx`

**Interfaces:**
- Consumes: `MediaFigure`, `PurchasePanel`, enriched products and purchase steps.

- [ ] **Step 1: Write failing page-content tests**

```tsx
expect(within(screen.getByRole('region', { name: '材料色谱' })).getAllByRole('img')).toHaveLength(5);
expect(screen.getByRole('region', { name: '如何购买' })).toBeVisible();
for (const product of contentByLocale.zh.products) {
  expect(screen.getByRole('link', { name: new RegExp(product.name) })).toHaveAttribute('href', `/products/${product.slug}`);
}
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/pages/HomePage.test.tsx src/pages/content-pages.test.tsx`

Expected: FAIL because the material spectrum and image-based product index are absent.

- [ ] **Step 3: Implement the approved homepage hierarchy**

Use one dominant hero image, one color-spectrum interaction, photographic product cards, solution previews, purchase steps and evidence-safe company facts. Remove decorative sections that duplicate the same message.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test -- src/pages/HomePage.test.tsx src/pages/content-pages.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add outputs/kaidiou-premium-site/src/pages/HomePage.tsx outputs/kaidiou-premium-site/src/pages/HomePage.test.tsx outputs/kaidiou-premium-site/src/pages/ProductsPage.tsx outputs/kaidiou-premium-site/src/pages/content-pages.test.tsx
git commit -m "feat: redesign homepage around material color"
```

### Task 5: 把五个产品页升级为完整深页

**Files:**
- Modify: `src/pages/ProductDetailPage.tsx`
- Modify: `src/pages/content-pages.test.tsx`

**Interfaces:**
- Consumes: all richer `Product` fields, `MediaFigure`, `PurchasePanel`.

- [ ] **Step 1: Write a failing product-depth test**

```tsx
for (const product of contentByLocale.zh.products) {
  render(
    <MemoryRouter initialEntries={[`/products/${product.slug}`]}>
      <Routes>
        <Route path="/products/:slug" element={<ProductDetailPage locale="zh" />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.getByRole('img', { name: product.name + '应用概念图' })).toBeVisible();
  expect(screen.getByRole('heading', { name: '选型前需要确认' })).toBeVisible();
  expect(screen.getByRole('heading', { name: '建议施工流程' })).toBeVisible();
  expect(screen.getByRole('link', { name: '询价采购' })).toHaveAttribute('href', expect.stringContaining(product.slug));
  cleanup();
}
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/pages/content-pages.test.tsx`

Expected: FAIL on the missing image, selection and purchase sections.

- [ ] **Step 3: Implement shared complete product detail layout**

Build the photo hero, quick facts, application chips, system layers, process, selection questions, FAQ, source boundary and three-way purchase CTA. Keep the component data-driven so all five pages share behavior without copy-paste routes.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test -- src/pages/content-pages.test.tsx`

Expected: PASS for all five Chinese and English routes.

- [ ] **Step 5: Commit**

```bash
git add outputs/kaidiou-premium-site/src/pages/ProductDetailPage.tsx outputs/kaidiou-premium-site/src/pages/content-pages.test.tsx
git commit -m "feat: build complete visual product detail pages"
```

### Task 6: 完善行业方案、关于与咨询页面

**Files:**
- Modify: `src/pages/SolutionsPage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Modify: `src/components/InquiryForm.tsx`
- Modify: related tests under `src/pages` and `src/components`

**Interfaces:**
- Consumes: `companyProfileByLocale`, `purchasePathsByLocale`, `MediaFigure` and query parameters `audience`, `request`, `product`.

- [ ] **Step 1: Write failing page-completeness tests**

```tsx
expect(screen.getAllByTestId('solution-visual')).toHaveLength(6);
expect(screen.getByRole('heading', { name: '企业主体与服务关系' })).toBeVisible();
expect(screen.getByLabelText('采购需求')).toHaveValue('sample');
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/pages/content-pages.test.tsx src/components/InquiryForm.test.tsx`

Expected: FAIL because solution visuals, company facts and request prefill are absent.

- [ ] **Step 3: Implement the evidence-led pages**

Add solution images and anchors, company history and legal-entity explanation, verified leader section only when available, purchase/contact channel cards, and query-driven form prefill. Preserve the no-backend warning.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm test -- src/pages/content-pages.test.tsx src/components/InquiryForm.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add outputs/kaidiou-premium-site/src/pages/SolutionsPage.tsx outputs/kaidiou-premium-site/src/pages/AboutPage.tsx outputs/kaidiou-premium-site/src/pages/ContactPage.tsx outputs/kaidiou-premium-site/src/components/InquiryForm.tsx outputs/kaidiou-premium-site/src/pages/content-pages.test.tsx outputs/kaidiou-premium-site/src/components/InquiryForm.test.tsx
git commit -m "feat: complete solutions company and inquiry content"
```

### Task 7: 应用材料色彩设计系统并完成全站回归

**Files:**
- Create: `src/styles/v2.css`
- Modify: `src/main.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/homepage-css.test.ts`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `README.md`
- Modify: `CONTENT-SOURCES.md`
- Update: `preview/*.png`

**Interfaces:**
- CSS contract: `.v2-*`, `.media-figure`, `.purchase-panel`, enhanced existing page classes.

- [ ] **Step 1: Write failing responsive and E2E expectations**

```ts
await expect(page.getByRole('img', { name: '纳米硅标线涂料应用概念图' })).toBeVisible();
await page.getByRole('link', { name: '询价采购' }).click();
await expect(page).toHaveURL(/contact\?request=project-quote&product=nano-silicon-marking-paint/);
expect(await page.locator('body').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
```

- [ ] **Step 2: Run E2E and verify RED**

Run: `npm run test:e2e -- --grep "premium v2"`

Expected: FAIL because the V2 visuals and purchase journey are not yet styled or complete.

- [ ] **Step 3: Implement `v2.css` and responsive behavior**

Use the approved palette, photo-led grids, material spectrum, disciplined motion, mobile menu compatibility, strong focus states and `prefers-reduced-motion`. Do not import external runtime fonts.

- [ ] **Step 4: Run complete verification**

Run:

```bash
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
git diff --check
```

Expected: all unit tests pass; production build succeeds; desktop/tablet/mobile Chromium checks pass with zero broken images, console errors or horizontal overflow; audit reports zero high-severity vulnerabilities; `git diff --check` is clean.

- [ ] **Step 5: Capture and inspect previews**

Capture homepage, products, one flagship product, about and purchase pages at 1440px and homepage at mobile width. Inspect image crops, typography, dense sections, footer, menu and form interactions. Fix any visible defect and rerun the affected tests.

- [ ] **Step 6: Update docs and commit**

```bash
git add outputs/kaidiou-premium-site
git commit -m "feat: deliver premium visual commerce site v2"
```

## Plan Self-Review

- Every design requirement maps to a task: media (1), content evidence (2), buying (3), homepage (4), products (5), company/solutions/contact (6), visual QA (7).
- The media and company models are defined before page consumers.
- No product performance figure is introduced without a source.
- The leader section explicitly supports a safe `null` state rather than a placeholder person.
- Each behavior change begins with a failing test and ends with focused plus full verification.
