import { contentByLocale, type Locale } from '../app/site-content';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  locale: Locale;
}

export const productsPageCopy = {
  zh: {
    eyebrow: '产品中心 / MATERIAL INDEX',
    title: '把地坪材料做成一个可选择的色彩与场景系统',
    introduction: '重点展示纳米硅标线涂料、纳米硅着色剂、硅晶自流平、彩砂自流平和水性聚氨酯砂浆。每个产品都从应用场景、基面条件、样板沟通和采购资料进入。',
    label: '五个核心材料条目',
  },
  en: {
    eyebrow: 'PRODUCTS / MATERIAL INDEX',
    title: 'A material system organized by color, setting, and purchasing dialogue',
    introduction: 'The core system covers nano-silicon marking paint, nano-silicon colorant, silicon-crystal self-leveling, colored-sand self-leveling, and waterborne PU mortar.',
    label: 'Five core material entries',
  },
} as const;

export function ProductsPage({ locale }: ProductsPageProps) {
  const content = contentByLocale[locale];
  const copy = productsPageCopy[locale];

  return (
    <main id="main-content" className="content-page products-page kdo-v2-page" data-locale={locale}>
      <section className="kdo-v2-hero kdo-v2-hero--products" aria-labelledby="products-title">
        <div className="shell-grid kdo-v2-hero__grid">
          <div className="kdo-v2-hero__copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="products-title">{copy.title}</h1>
            <p>{copy.introduction}</p>
          </div>
          <div className="kdo-v2-hero__rail" aria-hidden="true">
            <span>MARKING</span>
            <span>COLOR</span>
            <span>SELF-LEVELING</span>
            <span>MORTAR</span>
          </div>
        </div>
      </section>

      <section className="kdo-product-gallery" aria-label={copy.label}>
        <div className="shell-grid kdo-product-gallery__grid">
          {content.products.map((product, index) => (
            <ProductCard key={product.slug} product={product} locale={locale} priority={index < 2} />
          ))}
        </div>
      </section>
    </main>
  );
}
