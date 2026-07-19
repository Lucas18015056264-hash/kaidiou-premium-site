import { Link } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import { contentByLocale, type Locale } from '../app/site-content';

interface AboutPageProps {
  locale: Locale;
}

export const aboutPageCopy = {
  zh: { eyebrow: '关于凯迪欧 / COMPANY NOTE', capabilities: '生产与研发沟通', evidence: '内容证据说明', action: '开始项目沟通', evidenceLabel: 'PUBLIC CONTENT / EVIDENCE' },
  en: { eyebrow: 'ABOUT KDO / COMPANY NOTE', capabilities: 'Production and R&D dialogue', evidence: 'Content evidence note', action: 'Start a project conversation', evidenceLabel: 'PUBLIC CONTENT / EVIDENCE' },
} as const;

export function AboutPage({ locale }: AboutPageProps) {
  const content = contentByLocale[locale];
  const copy = aboutPageCopy[locale];

  return (
    <main id="main-content" className="content-page about-page" data-locale={locale}>
      <section className="about-hero section-shell" aria-labelledby="about-title">
        <div className="shell-grid about-hero__grid">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="about-title">{content.about.thesis}</h1>
          <p>{content.about.introduction}</p>
          <div className="about-hero__strata" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
      </section>
      <section className="section-shell about-timeline" aria-label={locale === 'zh' ? '工作方式' : 'Working method'}>
        <div className="shell-grid about-timeline__grid">
          {content.about.timeline.map((item) => (
            <article key={item.label} className="about-timeline__step">
              <span>{item.label}</span><h2>{item.title}</h2><p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-shell about-capabilities" aria-labelledby="capabilities-title">
        <div className="shell-grid about-capabilities__grid">
          <div><p className="eyebrow">MATERIAL / COLOR / INFORMATION</p><h2 id="capabilities-title">{copy.capabilities}</h2></div>
          <div className="about-capabilities__layers">
            {content.capabilities.map((capability) => <article key={capability.id}><span>{capability.evidence === 'verified' ? 'VERIFIED' : 'COMPANY MATERIAL'}</span><h3>{capability.title}</h3><p>{capability.approvedCopy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section-shell about-evidence" aria-labelledby="evidence-title">
        <div className="shell-grid about-evidence__grid">
          <p className="about-evidence__label">{copy.evidenceLabel}</p>
          <div><h2 id="evidence-title">{copy.evidence}</h2><p>{content.about.evidenceNote}</p></div>
          <Link className="text-action" to={localePath(locale, '/contact?audience=project-owner')}>{copy.action}<span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
