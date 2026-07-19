import { Link } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import type { Locale } from '../app/site-content';

interface SiteFooterProps {
  locale: Locale;
}

export const siteFooterCopy = {
  zh: {
    statement: '从地面场景出发，组织材料、色彩与项目沟通。',
    products: '产品中心',
    solutions: '行业应用',
    contact: '咨询购买',
    identity: '凯迪欧工业地坪材料',
    evidence: '公开信息以官方资料与企业确认为准',
  },
  en: {
    statement: 'Material, color, and project dialogue organized around the floor.',
    products: 'Products',
    solutions: 'Applications',
    contact: 'Enquiry',
    identity: 'KDO Industrial Floor Materials',
    evidence: 'Public information follows official material and company confirmation',
  },
} as const;

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = siteFooterCopy[locale];

  return (
    <footer className="site-footer">
      <div className="shell-grid site-footer__grid">
        <div className="site-footer__statement">
          <span className="utility-label">KDO / MATERIAL SYSTEMS</span>
          <p>{copy.statement}</p>
        </div>

        <div className="site-footer__links">
          <Link to={localePath(locale, '/products')}>{copy.products}</Link>
          <Link to={localePath(locale, '/solutions')}>{copy.solutions}</Link>
          <Link to={localePath(locale, '/contact')}>{copy.contact}</Link>
        </div>

        <div className="site-footer__meta">
          <span>{copy.identity}</span>
          <span>{copy.evidence}</span>
        </div>
      </div>
    </footer>
  );
}
