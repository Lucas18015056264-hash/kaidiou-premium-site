import { Link } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import type { Locale, Product } from '../app/site-content';
import { MediaFigure } from './MediaFigure';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  priority?: boolean;
}

export function ProductCard({ product, locale, priority = false }: ProductCardProps) {
  return (
    <Link
      className={`product-card${priority ? ' product-card--priority' : ''}`}
      data-product-slug={product.slug}
      to={localePath(locale, `/products/${product.slug}`)}
    >
      <MediaFigure mediaId={product.packageMediaId} locale={locale} priority={priority} captionMode="hidden" />
      <span className="product-card__type">
        {priority
          ? locale === 'zh'
            ? '纳米硅重点产品'
            : 'Nano-silicon flagship'
          : locale === 'zh'
            ? '材料体系'
            : 'Material system'}
      </span>
      <h2>{product.name}</h2>
      <p>{product.summary}</p>
      <ul aria-label={locale === 'zh' ? '适用方向' : 'Application directions'}>
        {product.applications.map((application) => (
          <li key={application}>{application}</li>
        ))}
      </ul>
      <span className="product-card__action">
        {locale === 'zh' ? '查看材料' : 'View material'}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
