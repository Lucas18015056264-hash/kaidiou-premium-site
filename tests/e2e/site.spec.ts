import { expect, test, type Page } from '@playwright/test';

const productSlugs = [
  'nano-silicon-marking-paint',
  'nano-silicon-colorant',
  'silicon-crystal-self-leveling',
  'colored-sand-self-leveling',
  'waterborne-pu-mortar',
] as const;

const routes = [
  { path: '/', minImages: 3 },
  { path: '/products', minImages: 5 },
  { path: '/products/nano-silicon-marking-paint', minImages: 2 },
  { path: '/products/nano-silicon-colorant', minImages: 2 },
  { path: '/solutions', minImages: 0 },
  { path: '/about', minImages: 0 },
  { path: '/contact', minImages: 0 },
  { path: '/en/products/nano-silicon-marking-paint', minImages: 2 },
  { path: '/en/contact', minImages: 0 },
  { path: '/not-a-real-route', minImages: 0 },
] as const;

async function openMobileMenuIfNeeded(page: Page) {
  const menu = page.locator('.menu-toggle');
  if (await menu.isVisible()) await menu.click();
}

async function loadImages(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = Math.max(240, Math.floor(window.innerHeight * 0.65));
      const timer = setInterval(() => {
        y += step;
        window.scrollTo(0, y);
        if (y >= document.documentElement.scrollHeight - window.innerHeight) {
          clearInterval(timer);
          setTimeout(resolve, 120);
        }
      }, 30);
    });
  });
  await page.locator('img').evaluateAll(async (imgs) => {
    await Promise.all(imgs.map(async (img) => {
      img.scrollIntoView({ block: 'center' });
      try { await img.decode(); } catch {}
    }));
  });
  await page.evaluate(() => window.scrollTo(0, 0));
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('kaidiou-locale', 'zh'));
});

test('homepage exposes audiences, product order, purchase path, and evidence boundaries', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('section.kdo-home-hero')).toBeVisible();
  await expect(page.locator('.kdo-audience-card')).toHaveCount(3);
  await expect(page.locator('.kdo-procurement-cards article')).toHaveCount(3);
  await expect(page.locator('.kdo-company-boundary')).toBeVisible();
  await expect(page.locator('[data-product-slug]')).toHaveCount(5);
  expect(await page.locator('[data-product-slug]').evaluateAll((links) => links.map((link) => link.getAttribute('data-product-slug')))).toEqual(productSlugs);
  await expect(page.locator('form.inquiry-form--compact')).toBeVisible();
  await expect(page.locator('figure[data-media-id="home-hero"] img')).toHaveAttribute('data-media-provenance', 'concept-visual');
  await expect(page.locator('figure[data-media-id="company-factory"] img')).toHaveAttribute('data-media-provenance', 'company-material');
});

test('product detail pages have concept media, package media, sections, and purchasing CTAs', async ({ page }) => {
  await page.goto('/products/nano-silicon-marking-paint');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('figure[data-media-id="product-marking"] img')).toHaveAttribute('data-media-provenance', 'concept-visual');
  await expect(page.locator('figure[data-media-id="pack-marking"] img')).toHaveAttribute('data-media-provenance', 'company-material');
  expect(await page.locator('.kdo-product-reading__body article').count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('.kdo-flagship-detail__cards article')).toHaveCount(2);
  await expect(page.locator('.kdo-flagship-detail__steps li')).toHaveCount(4);
  await expect(page.locator('.kdo-purchase-band a')).toHaveAttribute('href', '/contact?audience=project-owner');
});

test('contact form supports audience prefill and demo-only submission', async ({ page }) => {
  await page.goto('/contact?audience=global-buyer');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('form.inquiry-form--full')).toBeVisible();
  const form = page.locator('form.inquiry-form--full');
  await expect(form.locator('select[name="audience"]')).toHaveValue('global-buyer');
  await form.locator('input[name="name"]').fill('Demo Buyer');
  await form.locator('input[name="company"]').fill('Demo Trading');
  await form.locator('input[name="contact"]').fill('buyer@example.com');
  await form.locator('input[name="location"]').fill('Singapore');
  await form.locator('input[name="area"]').fill('1200');
  await form.locator('textarea[name="requirements"]').fill('Need material sheets and color samples.');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[role="status"]')).toBeVisible();
});

test('language switching and deep English links are route-driven', async ({ page }) => {
  await page.goto('/en/contact?audience=distributor');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('select[name="audience"]')).toHaveValue('distributor');
  await openMobileMenuIfNeeded(page);
  await page.locator('.locale-switch button').first().click();
  await expect(page).toHaveURL(/\/contact\?audience=distributor$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');

  await page.goto('/en/products/nano-silicon-marking-paint');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Nano-Silicon Marking Paint');
  await expect(page.locator('.kdo-purchase-band a')).toHaveAttribute('href', '/en/contact?audience=project-owner');
});

test('key routes have one main region, one h1, working images, no overflow, and no browser errors', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  for (const route of routes) {
    await test.step(route.path, async () => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      await loadImages(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${route.path} overflow at ${testInfo.project.name}`).toBeLessThanOrEqual(testInfo.project.use.viewport?.width ?? 1440);
      expect(await page.locator('img').count()).toBeGreaterThanOrEqual(route.minImages);
      expect(await page.locator('img').evaluateAll((imgs) => imgs.every((img) => img.alt.trim().length > 0 && img.complete && img.naturalWidth > 0))).toBe(true);
    });
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('keyboard skip link and mobile menu remain accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.menu-toggle');
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.locator('.site-navigation')).toBeVisible();
  await page.locator('.site-navigation a[href="/products"]').click();
  await expect(page).toHaveURL(/\/products$/);
});
