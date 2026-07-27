import { describe, expect, it } from 'vitest';

import {
  CTA,
  FILM_DURATION_SECONDS,
  FILM_FPS,
  OFFICIAL_CASES,
  PRODUCTS,
  SCENES,
  TOTAL_FRAMES,
} from './timeline-data';

describe('KDO film timeline', () => {
  it('renders a complete 42-second timeline at 24fps', () => {
    expect(FILM_FPS).toBe(24);
    expect(FILM_DURATION_SECONDS).toBe(42);
    expect(TOTAL_FRAMES).toBe(1008);
    expect(SCENES.reduce((sum, scene) => sum + scene.durationInFrames, 0)).toBe(TOTAL_FRAMES);
  });

  it('uses the approved product system and public-case boundary', () => {
    expect(PRODUCTS.map((product) => product.name)).toEqual([
      '纳米硅划线漆',
      '纳米硅着色剂',
      '硅晶自流平',
      '彩砂自流平',
      '水性聚氨酯砂浆',
    ]);
    expect(OFFICIAL_CASES).toHaveLength(3);
    expect(OFFICIAL_CASES.every((item) => item.label === '凯迪欧官网公开案例')).toBe(true);
  });

  it('contains the verified consultation path and no banned claims', () => {
    const publicCopy = JSON.stringify({ SCENES, OFFICIAL_CASES, PRODUCTS, CTA });

    expect(CTA.phone).toBe('400-8898-733');
    expect(CTA.website).toBe('www.jsdiou.com');
    expect(publicCopy).not.toMatch(/行业第一|首创|零问题|永久|绝对|客户推荐/);
  });
});
