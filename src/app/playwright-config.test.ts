import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const config = readFileSync(resolve(process.cwd(), 'playwright.config.ts'), 'utf8');
const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};

describe('unified Playwright configuration', () => {
  it('owns the final end-to-end suite and serves one freshly built production bundle', () => {
    expect(config).toContain("testDir: './tests/e2e'");
    expect(config).toContain("baseURL: 'http://127.0.0.1:4174'");
    expect(config).toMatch(/command: 'npm run test:e2e:server'/);
    expect(config).toMatch(/url: 'http:\/\/127\.0\.0\.1:4174'/);
    expect(config).toContain('reuseExistingServer: false');
    expect(packageJson.scripts['test:e2e:server']).toBe(
      'npm run build && vite preview --host 127.0.0.1 --port 4174 --strictPort',
    );
  });

  it('defines desktop, tablet, and mobile Chromium acceptance viewports in one place', () => {
    expect(config).toContain("name: 'chromium-desktop'");
    expect(config).toContain('viewport: { width: 1440, height: 1000 }');
    expect(config).toContain("name: 'chromium-tablet'");
    expect(config).toContain('viewport: { width: 768, height: 1024 }');
    expect(config).toContain("name: 'chromium-mobile'");
    expect(config).toContain('viewport: { width: 390, height: 844 }');
  });
});
