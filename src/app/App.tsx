import { Fragment, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { type InquiryAudience } from '../components/InquiryForm';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductsPage } from '../pages/ProductsPage';
import { SolutionsPage } from '../pages/SolutionsPage';
import { localeFromPath, switchLocalePath } from './locale-path';
import { routerBaseName } from './deployment';
import { SeoHead } from './seo';
import type { Locale } from './site-content';

function ContactRoute({ locale }: { locale: Locale }) {
  const [searchParams] = useSearchParams();
  const requestedAudience = searchParams.get('audience');
  const audience: InquiryAudience | undefined =
    requestedAudience === 'project-owner' ||
    requestedAudience === 'distributor' ||
    requestedAudience === 'global-buyer'
      ? requestedAudience
      : undefined;

  return <ContactPage locale={locale} audience={audience} />;
}

function localeRoutes(locale: Locale) {
  const prefix = locale === 'en' ? '/en' : '';
  const route = (path: string) => `${prefix}${path}` || '/';

  return (
    <Fragment key={locale}>
      <Route path={route('')} element={<HomePage locale={locale} />} />
      <Route path={route('/products')} element={<ProductsPage locale={locale} />} />
      <Route path={route('/products/:slug')} element={<ProductDetailPage locale={locale} />} />
      <Route path={route('/solutions')} element={<SolutionsPage locale={locale} />} />
      <Route path={route('/about')} element={<AboutPage locale={locale} />} />
      <Route path={route('/contact')} element={<ContactRoute locale={locale} />} />
    </Fragment>
  );
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(location.pathname);
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;

    main.tabIndex = -1;
    if (previousPathname.current === location.pathname) return;

    previousPathname.current = location.pathname;
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    navigate({
      pathname: switchLocalePath(location.pathname, nextLocale),
      search: location.search,
      hash: location.hash,
    });
  };

  return (
    <div className="site-shell">
      <SeoHead locale={locale} pathname={location.pathname} />
      <a className="skip-link" href="#main-content">
        {locale === 'zh' ? '跳到主要内容' : 'Skip to main content'}
      </a>
      <SiteHeader locale={locale} onLocaleChange={changeLocale} />
      <Routes>
        {localeRoutes('zh')}
        {localeRoutes('en')}
        <Route path="*" element={<NotFoundPage locale={locale} />} />
      </Routes>
      <SiteFooter locale={locale} />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter basename={routerBaseName()}>
      <AppShell />
    </BrowserRouter>
  );
}
