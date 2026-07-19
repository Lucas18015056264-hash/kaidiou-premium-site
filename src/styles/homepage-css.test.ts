import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');

describe('homepage CSS regression guard', () => {
  it('allows hero title lines to wrap instead of clipping English on mobile', () => {
    const titleLineRule = css.match(/\.home-hero__copy h1 span\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(titleLineRule).not.toContain('white-space: nowrap');
    expect(titleLineRule).toContain('overflow-wrap: anywhere');
  });

  it('does not retain the superseded Task 2 homepage selectors', () => {
    for (const selector of [
      '.hero-section',
      '.hero-copy',
      '.material-build',
      '.material-layer',
      '.audience-paths',
      '.zoning-key',
    ]) {
      expect(css).not.toContain(selector);
    }
  });

  it('disables product-index motion and hover transforms when motion is reduced', () => {
    const productIndexReducedMotionRule = css.match(
      /\.product-index-card,\s*\.product-index-card:hover\s*\{([^}]*)\}/,
    )?.[1] ?? '';

    expect(productIndexReducedMotionRule).toContain('transition: none');
    expect(productIndexReducedMotionRule).toContain('transform: none');
  });
});
