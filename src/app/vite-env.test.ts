import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Vite environment typing', () => {
  it('declares the optional verified site URL build variable', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/vite-env.d.ts'), 'utf8');

    expect(source).toContain('readonly VITE_SITE_URL?: string;');
  });
});
