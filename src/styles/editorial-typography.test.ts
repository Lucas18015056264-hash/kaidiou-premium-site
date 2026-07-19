import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
const v2Css = readFileSync(resolve(process.cwd(), 'src/styles/v2.css'), 'utf8');

describe('editorial typography tokens', () => {
  it('defines the approved display stack and reading rhythm', () => {
    expect(tokens).toContain('--font-display: "DengXian", "PingFang SC", "Microsoft YaHei UI", sans-serif;');
    expect(tokens).toContain('--text-body: clamp(1rem,');
    expect(globalCss).toContain('line-height: 1.72');

    const globalHeadingRule = globalCss.match(/h1,\s*h2\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(globalHeadingRule).toContain('letter-spacing: -0.025em');
    expect(globalHeadingRule).toContain('line-height: 1.12');
  });

  it('keeps the home title balanced and constrained', () => {
    const homeTitleRule = v2Css.match(/\.kdo-home-hero h1\s*\{([^}]*)\}/)?.[1] ?? '';
    const mobileHomeTitleRule = v2Css.match(/@media \(max-width: 44rem\)\s*\{[\s\S]*?\.kdo-home-hero h1\s*\{([^}]*)\}/)?.[1] ?? '';
    const homeHeadingRule = globalCss.match(/\.home-page h2\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(homeTitleRule).toContain('text-wrap: balance');
    expect(homeTitleRule).toContain('max-width: 9.5ch');
    expect(homeTitleRule).toContain('font-size: clamp(3rem, 5vw, 4.9rem)');
    expect(mobileHomeTitleRule).toContain('max-width: 9.5ch');
    expect(mobileHomeTitleRule).toContain('font-size: clamp(3rem, 5vw, 4.9rem)');
    expect(homeHeadingRule).toContain('line-height: 1.12');
  });

  it('keeps product and case cards readable without losing their structure', () => {
    const productBodyRule = v2Css.match(/\.product-card p\s*\{([^}]*)\}/)?.[1] ?? '';
    const caseTitleRule = v2Css.match(/\.kdo-case-card h3\s*\{([^}]*)\}/)?.[1] ?? '';
    const caseBodyRule = v2Css.match(/\.kdo-case-card__copy > p:not\(\.eyebrow\)\s*\{([^}]*)\}/)?.[1] ?? '';
    const caseEyebrowRule = v2Css.match(/\.kdo-case-card__copy \.eyebrow\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(productBodyRule).toContain('line-height: 1.7');
    expect(caseTitleRule).toContain('line-height: 1.24');
    expect(caseTitleRule).toContain('letter-spacing: -0.015em');
    expect(caseBodyRule).toContain('font-size: 0.98rem');
    expect(caseBodyRule).toContain('line-height: 1.72');
    expect(caseEyebrowRule).toContain('font-family: var(--font-body)');
    expect(caseEyebrowRule).toContain('font-weight: 600');
    expect(caseEyebrowRule).toContain('letter-spacing: 0.04em');
  });
});
