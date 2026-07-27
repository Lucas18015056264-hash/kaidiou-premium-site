import { describe, expect, it } from 'vitest';

import { CTA, OFFICIAL_CASES, PRODUCTS, SCENES } from './timeline-data';

describe('public film copy contract', () => {
  it('labels every published project image as an official-site record', () => {
    expect(OFFICIAL_CASES).toHaveLength(3);
    expect(
      OFFICIAL_CASES.every(
        (item) => item.label === '凯迪欧官网公开案例',
      ),
    ).toBe(true);
  });

  it('keeps public consultation details exact', () => {
    expect(CTA.phone).toBe('400-8898-733');
    expect(CTA.website).toBe('www.jsdiou.com');
    expect(CTA.audiences).toContain('海外采购');
  });

  it('uses only the five brochure-backed product families', () => {
    expect(PRODUCTS.map((product) => product.name)).toEqual([
      '纳米硅划线漆',
      '纳米硅着色剂',
      '硅晶自流平',
      '彩砂自流平',
      '水性聚氨酯砂浆',
    ]);
  });

  it('keeps the six-scene narrative order', () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([
      'opening',
      'material',
      'flagships',
      'cases',
      'system',
      'cta',
    ]);
  });
});
