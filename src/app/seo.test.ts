import { createElement } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { contentByLocale } from './site-content';

import {
  SeoHead,
  buildOrganizationSchema,
  buildPageSeo,
  buildStructuredData,
} from './seo';

describe('SEO metadata and structured data', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    document.head.querySelectorAll('[data-kaidiou-seo]').forEach((element) => element.remove());
  });

  it('keeps organization schema within the reviewed public content boundary', () => {
    const schema = buildOrganizationSchema('zh');
    const serialised = JSON.stringify(schema);

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'KDO / 凯迪欧',
    });
    expect(serialised).not.toMatch(/logo|rating|founder|employee|规模/i);
  });

  it('stores SEO copy in SiteContent and does not retain an independent SEO copy map', () => {
    const seoContent = Reflect.get(contentByLocale.zh, 'seo') as
      | { organization: { name: string }; product: { category: string } }
      | undefined;
    const seoSource = readFileSync(resolve(process.cwd(), 'src/app/seo.ts'), 'utf8');

    expect(seoContent).toBeDefined();
    if (!seoContent) return;

    expect(buildOrganizationSchema('zh')).toMatchObject({ name: seoContent.organization.name });
    expect(buildStructuredData('zh', '/products/nano-silicon-marking-paint')[1]).toMatchObject({
      category: seoContent.product.category,
    });
    expect(seoSource).not.toContain('const pageCopy');
  });

  it('uses a verified site URL with the real English pathname prefix', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://site.example');

    expect(buildPageSeo('en', '/en/products/nano-silicon-marking-paint')).toEqual(
      expect.objectContaining({
        title: 'Nano-Silicon Marking Paint | KDO',
        canonical: 'https://site.example/en/products/nano-silicon-marking-paint',
        locale: 'en_US',
        alternates: {
          'zh-CN': 'https://site.example/products/nano-silicon-marking-paint',
          en: 'https://site.example/en/products/nano-silicon-marking-paint',
          'x-default': 'https://site.example/products/nano-silicon-marking-paint',
        },
      }),
    );
  });

  it('omits canonical, Open Graph URL, and schema URLs when VITE_SITE_URL is absent', () => {
    vi.stubEnv('VITE_SITE_URL', '');
    const schemas = buildStructuredData('zh', '/contact');
    render(createElement(SeoHead, { locale: 'zh', pathname: '/contact' }));

    expect(buildPageSeo('zh', '/contact').canonical).toBeUndefined();
    expect(JSON.stringify(schemas)).not.toMatch(/"url"|"item"/);
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('link[rel="alternate"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
  });

  it('rejects invalid site URLs and leaves no URL nodes in metadata or schemas', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://site.example/not-a-root');

    const seo = buildPageSeo('zh', '/contact');
    const schemas = buildStructuredData('zh', '/contact');
    render(createElement(SeoHead, { locale: 'zh', pathname: '/contact' }));

    expect(seo.canonical).toBeUndefined();
    expect(JSON.stringify(schemas)).not.toMatch(/"url"|"item"/);
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  });

  it.each([
    'http://site.example',
    'https://site.example?campaign=launch',
    'https://site.example#top',
  ])('rejects a non-root or non-HTTPS VITE_SITE_URL (%s)', (siteUrl) => {
    vi.stubEnv('VITE_SITE_URL', siteUrl);

    expect(buildPageSeo('en', '/contact').canonical).toBeUndefined();
  });

  it('creates only organization, product, and breadcrumb schemas from the safe product record', () => {
    const schemas = buildStructuredData('en', '/en/products/nano-silicon-marking-paint');

    expect(schemas.map((schema) => schema['@type'])).toEqual([
      'Organization',
      'Product',
      'BreadcrumbList',
    ]);
    expect(JSON.stringify(schemas)).toContain('Nano-Silicon Marking Paint');
    expect(JSON.stringify(schemas)).not.toMatch(/offers|aggregateRating|brand|logo|founder/i);
  });

  it('marks unknown and invalid-product routes noindex without canonical or structured data', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://site.example');

    for (const [locale, pathname] of [
      ['zh', '/unknown-route'],
      ['en', '/en/products/not-a-material'],
    ] as const) {
      const seo = buildPageSeo(locale, pathname);
      expect(Reflect.get(seo, 'robots')).toBe('noindex, nofollow');
      expect(seo.canonical).toBeUndefined();
      expect(Reflect.get(seo, 'alternates')).toBeUndefined();
      expect(buildStructuredData(locale, pathname)).toEqual([]);
    }

    render(createElement(SeoHead, { locale: 'en', pathname: '/en/products/not-a-material' }));
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });

  it('updates title, description, Open Graph, canonical, and JSON-LD in the document head', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://site.example');
    render(createElement(SeoHead, { locale: 'zh', pathname: '/contact' }));

    expect(document.title).toBe('咨询与购买 | 凯迪欧地坪漆');
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      '提交项目、渠道或海外采购需求，获取产品资料与样品沟通。',
    );
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      '咨询与购买 | 凯迪欧地坪漆',
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://site.example/contact',
    );
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://site.example/contact',
    );
    expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website',
    );
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://site.example/media/v3/case-wanda-garage.jpg',
    );
    expect(
      [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"]')].map((link) => [
        link.hreflang,
        link.href,
      ]),
    ).toEqual([
      ['zh-CN', 'https://site.example/contact'],
      ['en', 'https://site.example/en/contact'],
      ['x-default', 'https://site.example/contact'],
    ]);
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(2);
  });

  it('does not publish a placeholder canonical or Open Graph URL in the static entry point', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('property="og:url"');
    expect(html).not.toContain('property="og:image"');
    expect(html).not.toContain('kaidiou.example');
    expect(html).toContain('property="og:type"');
  });
});
