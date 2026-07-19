import { Link } from 'react-router-dom';

import { localePath } from '../app/locale-path';
import { contentByLocale, type Locale } from '../app/site-content';

interface SolutionsPageProps {
  locale: Locale;
}

export const solutionsPageCopy = {
  zh: {
    eyebrow: '行业应用 / FIELD SYSTEMS',
    title: '让材料选择回到真实使用环境',
    introduction: '每个场景都从环境挑战、推荐体系和实施关注点展开，先对齐项目条件，再进入材料资料沟通。',
    challenge: '环境挑战',
    system: '推荐体系',
    focus: '实施关注点',
    action: '咨询此场景',
    label: '行业应用列表',
  },
  en: {
    eyebrow: 'APPLICATIONS / FIELD SYSTEMS',
    title: 'Bring material choice back to the operating environment.',
    introduction: 'Each setting moves from challenge to system direction and implementation considerations before a material conversation begins.',
    challenge: 'Environmental challenge',
    system: 'Recommended system',
    focus: 'Implementation focus',
    action: 'Discuss this setting',
    label: 'Application list',
  },
} as const;

export function SolutionsPage({ locale }: SolutionsPageProps) {
  const content = contentByLocale[locale];
  const copy = solutionsPageCopy[locale];

  return (
    <main id="main-content" className="content-page solutions-page kdo-v2-page" data-locale={locale}>
      <section className="kdo-v2-hero kdo-v2-hero--solutions" aria-labelledby="solutions-title">
        <div className="shell-grid kdo-v2-hero__grid">
          <div className="kdo-v2-hero__copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="solutions-title">{copy.title}</h1>
            <p>{copy.introduction}</p>
          </div>
        </div>
      </section>
      <section className="section-shell solutions-ledger" aria-label={copy.label}>
        <div className="shell-grid solutions-ledger__grid">
          {content.solutions.map((solution) => (
            <article key={solution.id} className="solution-ledger-card">
              <div className="solution-ledger-card__identity">
                <span>{solution.id.replace(/-/g, ' / ')}</span>
                <h2>{solution.name}</h2>
              </div>
              <p className="solution-ledger-card__description">{solution.description}</p>
              <div className="solution-ledger-card__facts">
                <div><span>{copy.challenge}</span><p>{solution.challenge}</p></div>
                <div><span>{copy.system}</span><p>{solution.recommendedSystem}</p></div>
                <div><span>{copy.focus}</span><p>{solution.implementationFocus}</p></div>
              </div>
              <div className="solution-ledger-card__footer">
                <ul>{solution.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul>
                <Link to={localePath(locale, '/contact?audience=project-owner')}>{copy.action}<b aria-hidden="true">→</b></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
