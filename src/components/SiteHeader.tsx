import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import type { Locale } from '../app/site-content';

interface SiteHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export const siteHeaderCopy = {
  zh: {
    navigation: [
      { to: '/products', label: '产品中心' },
      { to: '/solutions', label: '行业应用' },
      { to: '/about', label: '关于凯迪欧' },
      { to: '/contact', label: '咨询购买' },
    ],
    primaryNavigation: '主导航',
    language: '语言',
    open: '打开导航',
    close: '关闭导航',
  },
  en: {
    navigation: [
      { to: '/products', label: 'Products' },
      { to: '/solutions', label: 'Applications' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Enquiry' },
    ],
    primaryNavigation: 'Primary navigation',
    language: 'Language',
    open: 'Open navigation',
    close: 'Close navigation',
  },
} as const;

export function SiteHeader({ locale, onLocaleChange }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copy = siteHeaderCopy[locale];

  return (
    <header className="site-header">
      <div className="site-header__inner shell-grid">
        <Link className="brand-mark" to={localePath(locale, '/')} aria-label="KDO / 凯迪欧">
          <span className="brand-mark__name">KDO / 凯迪欧</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label={isMenuOpen ? copy.close : copy.open}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          id="site-navigation"
          className={`site-navigation${isMenuOpen ? ' is-open' : ''}`}
          aria-label={copy.primaryNavigation}
        >
          <div className="site-navigation__links">
            {copy.navigation.map((item) => (
              <NavLink
                key={item.to}
                to={localePath(locale, item.to)}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="locale-switch" aria-label={copy.language}>
            <button type="button" aria-pressed={locale === 'zh'} onClick={() => onLocaleChange('zh')}>
              中文
            </button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={locale === 'en'} onClick={() => onLocaleChange('en')}>
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
