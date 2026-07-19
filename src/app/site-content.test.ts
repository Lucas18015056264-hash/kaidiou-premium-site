import { describe, expect, it } from 'vitest';
import * as inquiryFormModule from '../components/InquiryForm';
import * as siteFooterModule from '../components/SiteFooter';
import * as siteHeaderModule from '../components/SiteHeader';
import * as aboutPageModule from '../pages/AboutPage';
import * as contactPageModule from '../pages/ContactPage';
import * as homePageModule from '../pages/HomePage';
import * as productDetailModule from '../pages/ProductDetailPage';
import * as productsPageModule from '../pages/ProductsPage';
import * as solutionsPageModule from '../pages/SolutionsPage';
import { contentByLocale } from './site-content';

const locales = ['zh', 'en'] as const;
const prohibitedPublicClaims = /Dior|Kaidior|行业第一|最全面|全球领先|永久|零维护|绝对|\b(?:best|no\.?\s*1|most comprehensive|global leader|permanent|zero[ -]maintenance|guaranteed)\b/i;
const numberToken = /\d+(?:[.,]\d+)?%?/g;

const expectedProducts = {
  zh: [
    ['nano-silicon-marking-paint', '纳米硅标线涂料'],
    ['nano-silicon-colorant', '纳米硅着色剂'],
    ['silicon-crystal-self-leveling', '硅晶自流平'],
    ['colored-sand-self-leveling', '彩砂自流平'],
    ['waterborne-pu-mortar', '水性聚氨酯砂浆'],
  ],
  en: [
    ['nano-silicon-marking-paint', 'Nano-Silicon Marking Paint'],
    ['nano-silicon-colorant', 'Nano-Silicon Colorant'],
    ['silicon-crystal-self-leveling', 'Silicon-Crystal Self-Leveling'],
    ['colored-sand-self-leveling', 'Colored-Sand Self-Leveling'],
    ['waterborne-pu-mortar', 'Waterborne PU Mortar'],
  ],
} as const;

const expectedSolutions = {
  zh: [
    ['food-and-beverage', '食品与饮料'],
    ['pharma-and-clean-spaces', '医药与洁净空间'],
    ['new-energy-and-manufacturing', '新能源与制造'],
    ['warehousing-and-logistics', '仓储与物流'],
    ['commercial-and-public-spaces', '商业与公共空间'],
    ['parking-and-traffic-marking', '停车场与交通标线'],
  ],
  en: [
    ['food-and-beverage', 'Food & Beverage'],
    ['pharma-and-clean-spaces', 'Pharma & Clean Spaces'],
    ['new-energy-and-manufacturing', 'New Energy & Manufacturing'],
    ['warehousing-and-logistics', 'Warehousing & Logistics'],
    ['commercial-and-public-spaces', 'Commercial & Public Spaces'],
    ['parking-and-traffic-marking', 'Parking & Traffic Marking'],
  ],
} as const;

interface StringEntry {
  path: string;
  text: string;
}

function getStringEntries(value: unknown, path = 'root'): StringEntry[] {
  if (typeof value === 'string') return [{ path, text: value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => getStringEntries(item, `${path}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => getStringEntries(item, `${path}.${key}`));
  }
  return [];
}

function publicCopyRegistry() {
  return {
    contentByLocale,
    homePageCopy: Reflect.get(homePageModule, 'homePageCopy'),
    inquiryFormCopy: Reflect.get(inquiryFormModule, 'formCopy'),
    siteHeaderCopy: Reflect.get(siteHeaderModule, 'siteHeaderCopy'),
    siteFooterCopy: Reflect.get(siteFooterModule, 'siteFooterCopy'),
    productsPageCopy: Reflect.get(productsPageModule, 'productsPageCopy'),
    productDetailCopy: Reflect.get(productDetailModule, 'productDetailCopy'),
    solutionsPageCopy: Reflect.get(solutionsPageModule, 'solutionsPageCopy'),
    aboutPageCopy: Reflect.get(aboutPageModule, 'aboutPageCopy'),
    contactPageCopy: Reflect.get(contactPageModule, 'contactPageCopy'),
  };
}

describe('public site content', () => {
  it('locks the exact five-product system and bilingual names', () => {
    for (const locale of locales) {
      expect(contentByLocale[locale].products.map(({ slug, name }) => [slug, name])).toEqual(
        expectedProducts[locale],
      );
    }
  });

  it('locks the exact six-industry system and bilingual ids', () => {
    for (const locale of locales) {
      expect(contentByLocale[locale].solutions.map(({ id, name }) => [id, name])).toEqual(
        expectedSolutions[locale],
      );
    }
  });

  it('provides three ordered audience journeys in both languages', () => {
    for (const locale of locales) {
      expect(contentByLocale[locale].audiences.map((item) => item.id)).toEqual([
        'project-owner',
        'distributor',
        'global-buyer',
      ]);
    }
  });

  it('attaches evidence and an internal source note to every product, solution, and flagship extension', () => {
    for (const locale of locales) {
      for (const record of [
        ...contentByLocale[locale].products,
        ...contentByLocale[locale].solutions,
      ]) {
        expect(['verified', 'company-material']).toContain(Reflect.get(record, 'evidence'));
        expect(Reflect.get(record, 'sourceNote')).toEqual(expect.stringMatching(/\S/));
      }

      for (const product of contentByLocale[locale].products.slice(0, 2)) {
        const flagship = Reflect.get(product, 'flagship');
        expect(flagship).toEqual(expect.objectContaining({
          evidence: expect.stringMatching(/^(verified|company-material)$/),
          sourceNote: expect.stringMatching(/\S/),
        }));
      }
    }
  });

  it('models marking guidance and colorant comparison without performance figures', () => {
    for (const locale of locales) {
      const [markingPaint, colorant] = contentByLocale[locale].products;
      const markingFlagship = Reflect.get(markingPaint, 'flagship') as unknown as Record<string, unknown>;
      const colorantFlagship = Reflect.get(colorant, 'flagship') as unknown as Record<string, unknown>;

      expect(markingFlagship).toEqual(expect.objectContaining({
        kind: 'marking',
        visual: expect.objectContaining({ src: '/media/v2/product-marking.webp' }),
        guidance: expect.any(Array),
        applicationSteps: expect.any(Array),
      }));
      expect((markingFlagship.applicationSteps as unknown[])?.length).toBeGreaterThanOrEqual(3);
      expect(colorantFlagship).toEqual(expect.objectContaining({
        kind: 'colorant',
        palette: expect.any(Array),
        substrateNotes: expect.any(Array),
        comparison: expect.objectContaining({ disclaimer: expect.stringMatching(/示意|illustration/i) }),
      }));
    }
  });

  it('recursively scans every registered public string for prohibited brands and absolute claims', () => {
    const registry = publicCopyRegistry();
    expect(Object.entries(registry).filter(([, value]) => value === undefined)).toEqual([]);

    for (const entry of getStringEntries(registry)) {
      expect(entry.text, entry.path).not.toMatch(prohibitedPublicClaims);
    }
  });

  it('recursively blocks unverified numeric claims while allowing only the 404 status label', () => {
    for (const entry of getStringEntries(publicCopyRegistry())) {
      if (entry.text.startsWith('/media/')) continue;
      if (entry.text.includes('400-8898-733')) continue;
      const numericTokens = entry.text.match(numberToken) ?? [];
      expect(numericTokens.filter((token) => token !== '404'), entry.path).toEqual([]);
    }
  });

  it('labels every capability with approved evidence and a source note', () => {
    for (const locale of locales) {
      for (const capability of contentByLocale[locale].capabilities) {
        expect(['verified', 'company-material']).toContain(capability.evidence);
        expect(Reflect.get(capability, 'sourceNote')).toEqual(expect.stringMatching(/\S/));
      }
    }
  });

  it('gives every product a V2 media pair, detail sections, and a purchase path', () => {
    for (const locale of locales) {
      for (const product of contentByLocale[locale].products) {
        expect(Reflect.get(product, 'mediaId')).toEqual(expect.stringMatching(/^product-/));
        expect(Reflect.get(product, 'packageMediaId')).toEqual(expect.stringMatching(/^pack-/));
        expect(Reflect.get(product, 'detailSections')).toEqual(expect.arrayContaining([
          expect.objectContaining({
            title: expect.stringMatching(/\S/),
            body: expect.stringMatching(/\S/),
          }),
        ]));
        expect(Reflect.get(product, 'purchase')).toEqual(expect.objectContaining({
          title: expect.stringMatching(/\S/),
          primaryAction: expect.stringMatching(/\S/),
          route: '/contact',
        }));
      }
    }
  });

  it('defines procurement journeys and public company boundaries for every locale', () => {
    for (const locale of locales) {
      expect(contentByLocale[locale].procurement.journeys.map((item) => item.audience)).toEqual([
        'project-owner',
        'distributor',
        'global-buyer',
      ]);
      expect(contentByLocale[locale].company.identity.brandName).toEqual(expect.stringMatching(/\S/));
      expect(contentByLocale[locale].company.identity.publicWebsite).toEqual(expect.stringMatching(/^https?:\/\//));
      expect(contentByLocale[locale].company.leader.publicName).toBeNull();
      expect(contentByLocale[locale].company.leader.fallbackCopy).toEqual(expect.stringMatching(/\S/));
    }
  });
});
