import { Link, useParams } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import { contentByLocale, type Locale, type ProductFlagship } from '../app/site-content';
import { MediaFigure } from '../components/MediaFigure';
import { NotFoundPage } from './NotFoundPage';

interface ProductDetailPageProps {
  locale: Locale;
}

export const productDetailCopy = {
  zh: {
    eyebrow: '材料条目 / FIELD NOTE',
    applications: '应用场景',
    characteristics: '材料沟通重点',
    substrates: '基面与范围',
    details: '具体资料',
    prompts: '询盘前建议准备',
    package: '产品包装资料',
    source: '资料来源：企业资料与官方公开信息整理',
    conceptNote: '概念视觉，非项目案例',
    purchasePrefix: '购买方式',
    officialContact: '官方公开购买路径以咨询/询盘为主，网站建议先提交项目条件，再对接产品资料、样板和渠道沟通。',
  },
  en: {
    eyebrow: 'MATERIAL ENTRY / FIELD NOTE',
    applications: 'Applications',
    characteristics: 'Material dialogue',
    substrates: 'Substrates and scope',
    details: 'Detailed material',
    prompts: 'Prepare before enquiry',
    package: 'Package material',
    source: 'Source: organized company material and official public information',
    conceptNote: 'Concept visual, not a project case',
    purchasePrefix: 'Buying path',
    officialContact: 'The verified public purchasing route is consultation/enquiry first. Submit project conditions, then align product material, samples, and channel dialogue.',
  },
} as const;

function FlagshipDetail({ flagship, locale }: { flagship: ProductFlagship; locale: Locale }) {
  if (flagship.kind === 'marking') {
    return (
      <section className="kdo-flagship-detail kdo-flagship-detail--marking" aria-label={flagship.visual.heading}>
        <div className="shell-grid kdo-flagship-detail__grid">
          <div>
            <p className="eyebrow">NANO-SILICON / MARKING</p>
            <h2>{flagship.visual.heading}</h2>
            <p>{flagship.visual.description}</p>
          </div>
          <div className="kdo-flagship-detail__cards">
            {flagship.guidance?.map((item) => (
              <article key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <ol className="kdo-flagship-detail__steps">
            {flagship.applicationSteps?.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="kdo-flagship-detail kdo-flagship-detail--colorant" aria-label={flagship.visual.heading}>
      <div className="shell-grid kdo-flagship-detail__grid">
        <div>
          <p className="eyebrow">NANO-SILICON / COLOR</p>
          <h2>{flagship.paletteTitle}</h2>
          <p>{flagship.visual.description}</p>
        </div>
        <ul className="kdo-mineral-palette" aria-label={flagship.paletteTitle}>
          {flagship.palette?.map((item) => (
            <li key={item.label} data-tone={item.tone}>
              <i aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="kdo-flagship-detail__cards">
          {flagship.substrateNotes?.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductDetailPage({ locale }: ProductDetailPageProps) {
  const { slug } = useParams();
  const product = contentByLocale[locale].products.find((item) => item.slug === slug);
  const copy = productDetailCopy[locale];

  if (!product) return <NotFoundPage locale={locale} kind="product" />;

  return (
    <main id="main-content" className="content-page product-detail-page kdo-v2-page" data-locale={locale}>
      <section className="kdo-product-hero" aria-labelledby="product-title">
        <div className="shell-grid kdo-product-hero__grid">
          <div className="kdo-product-hero__copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="product-title">{product.name}</h1>
            <p>{product.summary}</p>
            <span>{copy.source}</span>
          </div>
          <MediaFigure mediaId={product.mediaId} locale={locale} priority captionMode="overlay" className="kdo-product-hero__media" />
        </div>
      </section>

      <section className="kdo-product-reading" aria-label={copy.details}>
        <div className="shell-grid kdo-product-reading__grid">
          <aside className="kdo-product-package" aria-label={copy.package}>
            <MediaFigure mediaId={product.packageMediaId} locale={locale} captionMode="visible" />
            <p>{copy.officialContact}</p>
          </aside>
          <div className="kdo-product-reading__body">
            <div className="kdo-product-facts">
              <article>
                <span>{copy.characteristics}</span>
                <ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article>
                <span>{copy.substrates}</span>
                <ul>{product.substrates.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article>
                <span>{copy.applications}</span>
                <ul>{product.applications.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </div>
            <div className="kdo-product-sections">
              {product.detailSections.map((section) => (
                <article key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {product.flagship ? <FlagshipDetail flagship={product.flagship} locale={locale} /> : null}

      <section className="kdo-purchase-band" aria-labelledby="purchase-title">
        <div className="shell-grid kdo-purchase-band__grid">
          <div>
            <p className="eyebrow">{copy.purchasePrefix}</p>
            <h2 id="purchase-title">{product.purchase.title}</h2>
            <p>{product.purchase.note}</p>
          </div>
          <ol>
            {product.dialoguePrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ol>
          <Link className="button button--primary" to={localePath(locale, `${product.purchase.route}?audience=project-owner`)}>
            {product.purchase.primaryAction}
          </Link>
        </div>
      </section>
    </main>
  );
}
