import type { Locale } from './site-content';

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized === '/en') return '/';
  if (normalized.startsWith('/en/')) return normalized.slice(3) || '/';
  return normalized;
}

export function localePath(locale: Locale, target: string): string {
  if (target.startsWith('#')) return target;

  const markerIndex = target.search(/[?#]/);
  const pathname = markerIndex >= 0 ? target.slice(0, markerIndex) : target;
  const suffix = markerIndex >= 0 ? target.slice(markerIndex) : '';
  const base = stripLocalePrefix(pathname || '/').replace(/\/+$/, '') || '/';

  if (locale === 'en') return `${base === '/' ? '/en' : `/en${base}`}${suffix}`;
  return `${base}${suffix}`;
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  return localePath(locale, stripLocalePrefix(pathname));
}
