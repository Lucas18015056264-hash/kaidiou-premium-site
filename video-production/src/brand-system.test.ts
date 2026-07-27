import { describe, expect, it } from 'vitest';

import { BRAND, safeAreaFor } from './brand-system';

describe('KDO film brand system', () => {
  it('uses the restrained industrial palette', () => {
    expect(BRAND.colors).toEqual({
      graphite: '#111411',
      mineral: '#F2F0E8',
      kdoGreen: '#2F6E4F',
      safety: '#D6A443',
      oxidized: '#A95E3F',
      mist: '#AAB2AA',
    });
  });

  it('keeps vertical captions inside platform-safe bounds', () => {
    expect(safeAreaFor('vertical')).toEqual({ top: 156, right: 72, bottom: 220, left: 72 });
    expect(safeAreaFor('horizontal')).toEqual({ top: 72, right: 96, bottom: 72, left: 96 });
  });
});
