import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('application entrypoint', () => {
  it('loads the React entry module from index.html', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).toContain('<script type="module" src="/src/main.tsx"></script>');
  });

  it('declares an inline favicon so browser checks do not request a missing asset', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).toContain('<link rel="icon" href="data:image/svg+xml,');
  });

  it('documents the exact product system, tablet coverage, and deployment security headers', () => {
    const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8');
    const sources = readFileSync(resolve(process.cwd(), 'CONTENT-SOURCES.md'), 'utf8');

    for (const product of [
      '纳米硅标线涂料',
      '纳米硅色浆',
      '硅晶自流平',
      '彩砂自流平',
      '水性聚氨酯砂浆',
    ]) {
      expect(readme).toContain(product);
      expect(sources).toContain(product);
    }
    expect(`${readme}\n${sources}`).not.toMatch(/水性工业涂料|防护涂层|项目配色体系/);
    expect(readme).toContain('768×1024');
    expect(readme).toMatch(/Chromium.*Firefox.*WebKit/s);
    for (const header of [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'frame-ancestors',
      'Referrer-Policy',
      'Permissions-Policy',
    ]) {
      expect(readme).toContain(header);
    }
  });
});
