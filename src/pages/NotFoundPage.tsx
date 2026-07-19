import { Link } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import { contentByLocale, type Locale } from '../app/site-content';

interface NotFoundPageProps {
  locale: Locale;
  kind?: 'page' | 'product';
}

export function NotFoundPage({ locale, kind = 'page' }: NotFoundPageProps) {
  const copy = contentByLocale[locale].notFound;
  const title = kind === 'product' ? copy.productTitle : copy.pageTitle;
  const body = kind === 'product' ? copy.productBody : copy.pageBody;

  return (
    <main id="main-content" className="content-page missing-page" data-not-found={kind}>
      <section className="section-shell missing-page__section" aria-labelledby="missing-title">
        <div className="shell-grid missing-page__grid">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="missing-title">{title}</h1>
          <p>{body}</p>
          <div className="missing-page__actions">
            <Link className="button button--primary" to={localePath(locale, '/products')}>
              {copy.productsAction}
            </Link>
            <Link className="text-action" to={localePath(locale, '/')}>
              {copy.homeAction}<span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
