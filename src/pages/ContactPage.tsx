import { InquiryForm, type InquiryAudience } from '../components/InquiryForm';
import { contentByLocale, type Locale } from '../app/site-content';

interface ContactPageProps {
  locale: Locale;
  audience?: InquiryAudience;
}

export const contactPageCopy = {
  zh: {
    eyebrow: '咨询购买 / PROJECT DIALOGUE',
    default: {
      heading: '告诉我们，地面将如何被使用',
      description: '可以从项目场景、配色、产品资料、经销合作或海外采购需求开始。',
    },
    'project-owner': {
      heading: '从项目现场条件开始沟通',
      description: '请提供使用场景、地面状况、项目地点、预期时间和希望咨询的产品方向。',
    },
    distributor: {
      heading: '从产品资料与区域合作开始',
      description: '请说明关注产品、服务区域、样品需求、客户类型与联系方式。',
    },
    'global-buyer': {
      heading: '从跨境采购需求开始',
      description: '请提供目标材料、样品需求、目的地、采购规格和英文联系方式。',
    },
    official: '官方公开购买路径以咨询/询盘为主。全国服务热线：400-8898-733；官网：www.jsdiou.com。',
  },
  en: {
    eyebrow: 'ENQUIRY / PROJECT DIALOGUE',
    default: {
      heading: 'Tell us how the floor will be used.',
      description: 'Begin with the setting, color, product information, distribution partnership, or global sourcing needs.',
    },
    'project-owner': {
      heading: 'Start with the project setting.',
      description: 'Share the application, floor condition, project location, expected timing, and product direction.',
    },
    distributor: {
      heading: 'Start with product material and regional partnership.',
      description: 'Share product interests, service region, sample needs, customer type, and contact details.',
    },
    'global-buyer': {
      heading: 'Start with the cross-border sourcing need.',
      description: 'Share target material, sample needs, destination, sourcing requirements, and an English-language contact.',
    },
    official: 'The verified public buying path is consultation/enquiry first. Official service hotline: 400-8898-733; website: www.jsdiou.com.',
  },
} as const;

export function ContactPage({ locale, audience }: ContactPageProps) {
  const copy = contactPageCopy[locale];
  const handoff = copy[audience ?? 'default'];
  const content = contentByLocale[locale];

  return (
    <main id="main-content" className="content-page contact-page kdo-v2-page" data-audience={audience ?? 'default'}>
      <section className="kdo-v2-hero kdo-v2-hero--contact" aria-labelledby="contact-title">
        <div className="shell-grid kdo-v2-hero__grid">
          <div className="kdo-v2-hero__copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="contact-title">{handoff.heading}</h1>
            <p>{handoff.description}</p>
            <p className="kdo-contact-official">{copy.official}</p>
          </div>
          <div className="kdo-v2-hero__rail" aria-hidden="true">
            {content.procurement.journeys.map((journey) => (
              <span key={journey.audience}>{journey.title}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="contact-form-section section-shell" aria-label={locale === 'zh' ? '询盘表单' : 'Enquiry form'}>
        <div className="shell-grid contact-form-section__grid">
          <InquiryForm locale={locale} audience={audience} />
        </div>
      </section>
    </main>
  );
}
