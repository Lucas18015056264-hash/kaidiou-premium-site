import type { FilmFormat } from './KdoBrandFilm';

export const BRAND = {
  colors: {
    graphite: '#111411',
    mineral: '#F2F0E8',
    kdoGreen: '#2F6E4F',
    safety: '#D6A443',
    oxidized: '#A95E3F',
    mist: '#AAB2AA',
  },
  fonts: {
    display: '"DengXian", "Microsoft YaHei UI", sans-serif',
    body: '"Microsoft YaHei UI", "Segoe UI", sans-serif',
  },
} as const;

export const safeAreaFor = (format: FilmFormat) =>
  format === 'vertical'
    ? { top: 156, right: 72, bottom: 220, left: 72 }
    : { top: 72, right: 96, bottom: 72, left: 96 };
