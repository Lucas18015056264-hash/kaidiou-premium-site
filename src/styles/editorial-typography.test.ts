import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
const v2Css = readFileSync(resolve(process.cwd(), 'src/styles/v2.css'), 'utf8');

describe('editorial typography tokens', () => {
  it('defines the approved display stack and reading rhythm', () => {
    expect(tokens).toContain('--font-display: "DengXian"');
    expect(globalCss).toContain('line-height: 1.72');
  });

  it('keeps the home title balanced and constrained', () => {
    const homeTitleRule = v2Css.match(/\.kdo-home-hero h1\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(homeTitleRule).toContain('text-wrap: balance');
    expect(homeTitleRule).toContain('font-size: clamp(3rem, 5vw, 4.9rem)');
  });
});
