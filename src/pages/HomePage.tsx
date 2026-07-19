import { Link } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import { contentByLocale, type Audience, type Locale } from '../app/site-content';
import { InquiryForm } from '../components/InquiryForm';
import { MediaFigure } from '../components/MediaFigure';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  locale: Locale;
}

const audienceDestinations: Readonly<Record<Audience['id'], string>> = {
  'project-owner': '/contact?audience=project-owner',
  distributor: '/contact?audience=distributor',
  'global-buyer': '/contact?audience=global-buyer',
};

export const homePageCopy = {
  zh: {
    hero: {
      eyebrow: 'KDO / 凯迪欧地坪漆',
      title: '工业地坪材料与低饱和色彩系统',
      intro: '面向工程甲方、经销商和海外采购商，把纳米硅标线、纳米硅着色剂、自流平与水性聚氨酯砂浆做成清晰、高级、可询盘的公开网站。',
      primaryAction: '咨询购买',
      secondaryAction: '查看产品',
    },
    roles: '按客户角色进入',
    products: '重点材料',
    procurement: '购买与合作方式',
    company: '官方资料边界',
    inquiry: '提交项目需求',
    official: '官方公开购买路径以咨询/询盘为主。研究确认官网为 www.jsdiou.com，全国服务热线为 400-8898-733。',
  },
  en: {
    hero: {
      eyebrow: 'KDO / Flooring Paint',
      title: 'Industrial floor materials with restrained color systems',
      intro: 'A premium public site for project owners, distribution partners, and global buyers, organized around nano-silicon marking, colorant, self-leveling, and waterborne PU mortar.',
      primaryAction: 'Start enquiry',
      secondaryAction: 'View products',
    },
    roles: 'Start by audience',
    products: 'Featured materials',
    procurement: 'Buying and partnership',
    company: 'Official information boundary',
    inquiry: 'Submit project needs',
    official: 'The verified public buying path is consultation/enquiry first. Research confirms www.jsdiou.com and service hotline 400-8898-733.',
  },
} as const;

export function HomePage({ locale }: HomePageProps) {
  const content = contentByLocale[locale];
  const copy = homePageCopy[locale];

  return (
    <main id="main-content" className="home-page kdo-v2-page" data-locale={locale}>
      <section className="kdo-home-hero" aria-labelledby="home-title">
        <MediaFigure mediaId="home-hero" locale={locale} priority captionMode="overlay" className="kdo-home-hero__media" />
        <div className="shell-grid kdo-home-hero__grid">
          <div className="kdo-home-hero__copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1 id="home-title">{copy.hero.title}</h1>
            <p>{copy.hero.intro}</p>
            <div className="action-row">
              <Link className="button button--primary" to={localePath(locale, '/contact')}>
                {copy.hero.primaryAction}
              </Link>
              <Link className="button button--secondary" to={localePath(locale, '/products')}>
                {copy.hero.secondaryAction}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="kdo-audience-band" aria-labelledby="audience-title">
        <div className="shell-grid section-heading">
          <p className="eyebrow">{copy.roles}</p>
          <h2 id="audience-title">{locale === 'zh' ? '让不同客户更快找到下一步' : 'Give each buyer a clear next step'}</h2>
        </div>
        <div className="shell-grid kdo-audience-band__grid">
          {content.audiences.map((audience) => (
            <Link key={audience.id} className="kdo-audience-card" to={localePath(locale, audienceDestinations[audience.id])}>
              <span>{audience.id.replace(/-/g, ' / ')}</span>
              <h3>{audience.title}</h3>
              <p>{audience.description}</p>
              <strong>{audience.callToAction} →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="product-section" aria-labelledby="featured-products">
        <div className="shell-grid section-heading">
          <p className="eyebrow">{copy.products}</p>
          <h2 id="featured-products">{locale === 'zh' ? '把颜色、基面和采购资料放到同一张材料地图里' : 'Place color, substrate, and sourcing material on one map'}</h2>
        </div>
        <div className="shell-grid product-section__grid">
          {content.products.map((product, index) => (
            <ProductCard key={product.slug} product={product} locale={locale} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="kdo-procurement-section" aria-labelledby="procurement-title">
        <div className="shell-grid kdo-procurement-section__grid">
          <div>
            <p className="eyebrow">{copy.procurement}</p>
            <h2 id="procurement-title">{content.procurement.title}</h2>
            <p>{content.procurement.introduction}</p>
          </div>
          <div className="kdo-procurement-cards">
            {content.procurement.journeys.map((journey) => (
              <article key={journey.audience}>
                <h3>{journey.title}</h3>
                <p>{journey.description}</p>
                <span>{journey.action}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kdo-company-boundary" aria-labelledby="company-title">
        <div className="shell-grid kdo-company-boundary__grid">
          <MediaFigure mediaId="company-factory" locale={locale} captionMode="visible" />
          <div>
            <p className="eyebrow">{copy.company}</p>
            <h2 id="company-title">{content.company.identity.brandName}</h2>
            <p>{content.company.identity.legalSubject}</p>
            <p>{copy.official}</p>
            <p>{content.company.leader.fallbackCopy}</p>
          </div>
        </div>
      </section>

      <section className="inquiry-section" aria-labelledby="home-inquiry-title">
        <div className="shell-grid inquiry-section__grid">
          <div className="inquiry-section__copy">
            <p className="eyebrow">{copy.inquiry}</p>
            <h2 id="home-inquiry-title">{locale === 'zh' ? '先说清楚地面将如何被使用' : 'Start with how the floor will be used'}</h2>
          </div>
          <div className="inquiry-section__form">
            <InquiryForm locale={locale} mode="compact" idPrefix="home-inquiry" accessibleName={copy.inquiry} />
          </div>
        </div>
      </section>
    </main>
  );
}
