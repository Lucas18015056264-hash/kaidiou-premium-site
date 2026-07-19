import { useEffect } from 'react';

import { localeFromPath, localePath, stripLocalePrefix } from './locale-path';
import { assetPath } from './deployment';
import { contentByLocale, type Locale, type Product } from './site-content';

type Schema = Record<string, unknown>;
type SeoPage = keyof (typeof contentByLocale)['zh']['seo']['pages'];

interface PageSeo {
  title: string;
  description: string;
  canonical?: string;
  alternates?: Readonly<Record<'zh-CN' | 'en' | 'x-default', string>>;
  locale: 'zh_CN' | 'en_US';
  robots?: 'noindex, nofollow';
  ogType: 'website' | 'product';
  ogImage?: string;
}

interface ResolvedRoute {
  valid: boolean;
  normalizedPath: string;
  basePath: string;
  page?: SeoPage;
  product?: Product;
}

function normalizePath(pathname: string) {
  const path = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function verifiedSiteUrl(value = import.meta.env.VITE_SITE_URL): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      !url.hostname ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    ) {
      return undefined;
    }
    return url.origin;
  } catch {
    return undefined;
  }
}

function urlFor(siteUrl: string | undefined, pathname: string) {
  return siteUrl ? `${siteUrl}${assetPath(normalizePath(pathname))}` : undefined;
}

function resolveRoute(locale: Locale, pathname: string): ResolvedRoute {
  const normalizedPath = normalizePath(pathname);
  const basePath = normalizePath(stripLocalePrefix(normalizedPath));
  if (localeFromPath(normalizedPath) !== locale) return { valid: false, normalizedPath, basePath };

  const pages: Readonly<Record<string, SeoPage>> = {
    '/': 'home',
    '/products': 'products',
    '/solutions': 'solutions',
    '/about': 'about',
    '/contact': 'contact',
  };
  const page = pages[basePath];
  if (page) return { valid: true, normalizedPath, basePath, page };

  const slug = basePath.match(/^\/products\/([^/]+)$/)?.[1];
  const product = slug
    ? contentByLocale[locale].products.find((candidate) => candidate.slug === slug)
    : undefined;
  if (product) return { valid: true, normalizedPath, basePath, product };

  return { valid: false, normalizedPath, basePath };
}

export function buildPageSeo(locale: Locale, pathname: string): PageSeo {
  const content = contentByLocale[locale];
  const route = resolveRoute(locale, pathname);

  if (!route.valid) {
    return {
      title: content.seo.notFound.title,
      description: content.seo.notFound.description,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      robots: 'noindex, nofollow',
      ogType: 'website',
    };
  }

  const page = route.page ? content.seo.pages[route.page] : undefined;
  const title = route.product
    ? `${route.product.name}${content.seo.product.titleSuffix}`
    : page!.title;
  const description = route.product?.summary ?? page!.description;
  const siteUrl = verifiedSiteUrl();
  const zhPath = localePath('zh', route.basePath);
  const enPath = localePath('en', route.basePath);

  return {
    title,
    description,
    canonical: urlFor(siteUrl, route.normalizedPath),
    ...(siteUrl ? {
      alternates: {
        'zh-CN': urlFor(siteUrl, zhPath)!,
        en: urlFor(siteUrl, enPath)!,
        'x-default': urlFor(siteUrl, zhPath)!,
      },
      ogImage: urlFor(
        siteUrl,
        route.product?.slug === 'nano-silicon-marking-paint'
          ? '/media/v2/product-marking.webp'
          : '/media/v2/home-hero.webp',
      ),
    } : {}),
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    ogType: route.product ? 'product' : 'website',
  };
}

export function buildOrganizationSchema(locale: Locale): Schema {
  const organization = contentByLocale[locale].seo.organization;
  const url = urlFor(verifiedSiteUrl(), localePath(locale, '/'));

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    description: organization.description,
    ...(url ? { url } : {}),
  };
}

function buildProductSchema(locale: Locale, route: ResolvedRoute): Schema | undefined {
  if (!route.product) return undefined;
  const content = contentByLocale[locale];
  const url = urlFor(verifiedSiteUrl(), route.normalizedPath);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: route.product.name,
    description: route.product.summary,
    category: content.seo.product.category,
    ...(url ? { url } : {}),
  };
}

function buildBreadcrumbSchema(locale: Locale, route: ResolvedRoute): Schema {
  const content = contentByLocale[locale];
  const items: { name: string; path: string }[] = [
    { name: content.seo.pages.home.breadcrumb, path: localePath(locale, '/') },
  ];

  if (route.product) {
    items.push(
      { name: content.seo.pages.products.breadcrumb, path: localePath(locale, '/products') },
      { name: route.product.name, path: route.normalizedPath },
    );
  } else if (route.page && route.page !== 'home') {
    items.push({ name: content.seo.pages[route.page].breadcrumb, path: route.normalizedPath });
  }

  const siteUrl = verifiedSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const itemUrl = urlFor(siteUrl, item.path);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };
}

export function buildStructuredData(locale: Locale, pathname: string): Schema[] {
  const route = resolveRoute(locale, pathname);
  if (!route.valid) return [];

  const product = buildProductSchema(locale, route);
  return [buildOrganizationSchema(locale), ...(product ? [product] : []), buildBreadcrumbSchema(locale, route)];
}

function addMeta(attribute: 'name' | 'property', key: string, value: string) {
  const element = document.createElement('meta');
  element.setAttribute(attribute, key);
  element.content = value;
  element.dataset.kaidiouSeo = 'true';
  document.head.append(element);
}

function addLink(rel: string, href: string, hrefLang?: string) {
  const element = document.createElement('link');
  element.rel = rel;
  element.href = href;
  if (hrefLang) element.hreflang = hrefLang;
  element.dataset.kaidiouSeo = 'true';
  document.head.append(element);
}

export function SeoHead({ locale, pathname }: { locale: Locale; pathname: string }) {
  useEffect(() => {
    const meta = buildPageSeo(locale, pathname);
    document.title = meta.title;
    document.head.querySelectorAll('[data-kaidiou-seo]').forEach((element) => element.remove());

    addMeta('name', 'description', meta.description);
    if (meta.robots) addMeta('name', 'robots', meta.robots);
    addMeta('property', 'og:title', meta.title);
    addMeta('property', 'og:description', meta.description);
    addMeta('property', 'og:locale', meta.locale);
    addMeta('property', 'og:type', meta.ogType);
    if (meta.ogImage) addMeta('property', 'og:image', meta.ogImage);
    if (meta.canonical) {
      addMeta('property', 'og:url', meta.canonical);
      addLink('canonical', meta.canonical);
    }
    if (meta.alternates) {
      for (const [hrefLang, href] of Object.entries(meta.alternates)) {
        addLink('alternate', href, hrefLang);
      }
    }
    buildStructuredData(locale, pathname).forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      script.dataset.kaidiouSeo = 'true';
      document.head.append(script);
    });
  }, [locale, pathname]);

  return null;
}
