import { useEffect, useState, type FormEvent } from 'react';

import type { Locale } from '../app/site-content';

export type InquiryAudience = 'project-owner' | 'distributor' | 'global-buyer';
export type InquiryMode = 'full' | 'compact';

export interface InquiryData {
  audience: string;
  name: string;
  company: string;
  contact: string;
  location: string;
  area: string;
  requirements: string;
}

export type InquiryErrorKey = 'audienceRequired' | 'nameRequired' | 'contactInvalid';

interface InquiryFormProps {
  locale: Locale;
  audience?: InquiryAudience;
  mode?: InquiryMode;
  idPrefix?: string;
  accessibleName?: string;
}

const initialData: InquiryData = {
  audience: '',
  name: '',
  company: '',
  contact: '',
  location: '',
  area: '',
  requirements: '',
};

export const formCopy = {
  zh: {
    formLabel: '项目询盘表单',
    audience: '您的身份',
    audiencePlaceholder: '请选择',
    audienceOptions: {
      'project-owner': '工程甲方',
      distributor: '经销商伙伴',
      'global-buyer': '海外采购商',
    },
    name: '姓名',
    company: '公司',
    contact: '电话或邮箱',
    location: '项目地点',
    area: '面积',
    requirements: '需求说明',
    submit: '记录需求',
    preSubmitNotice: '演示版不会发送至服务器；正式上线需补充并确认隐私政策。',
    demoNotice: '需求已记录，此演示版本不会发送到服务器',
    errors: {
      audienceRequired: '请选择您的身份',
      nameRequired: '请填写姓名',
      contactInvalid: '请提供有效的电话或邮箱',
    },
  },
  en: {
    formLabel: 'Project enquiry form',
    audience: 'Your role',
    audiencePlaceholder: 'Select a role',
    audienceOptions: {
      'project-owner': 'Project owner',
      distributor: 'Distributor',
      'global-buyer': 'Global buyer',
    },
    name: 'Name',
    company: 'Company',
    contact: 'Phone or email',
    location: 'Project location',
    area: 'Area',
    requirements: 'What do you need?',
    submit: 'Record enquiry',
    preSubmitNotice: 'This demo does not send data to a server; connect a real form, privacy policy, and company-confirmed recipient before launch.',
    demoNotice: 'Your enquiry has been recorded. This demo does not send data to a server.',
    errors: {
      audienceRequired: 'Select your role.',
      nameRequired: 'Enter your name.',
      contactInvalid: 'Enter a valid phone number or email address.',
    },
  },
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(?=.*\d)[\d\s()+-]{6,}$/;

export function validateInquiry(
  data: Pick<InquiryData, 'audience' | 'name' | 'contact'>,
  _locale: Locale,
  mode: InquiryMode = 'full',
): Record<string, InquiryErrorKey> {
  const errors: Record<string, InquiryErrorKey> = {};

  if (!data.audience) errors.audience = 'audienceRequired';
  if (mode === 'full' && !data.name.trim()) errors.name = 'nameRequired';
  if (!emailPattern.test(data.contact.trim()) && !phonePattern.test(data.contact.trim())) {
    errors.contact = 'contactInvalid';
  }

  return errors;
}

export function InquiryForm({
  locale,
  audience,
  mode = 'full',
  idPrefix = 'inquiry',
  accessibleName,
}: InquiryFormProps) {
  const copy = formCopy[locale];
  const [data, setData] = useState<InquiryData>({ ...initialData, audience: audience ?? '' });
  const [errors, setErrors] = useState<Record<string, InquiryErrorKey>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setData((current) => ({ ...current, audience: audience ?? '' }));
    setErrors((current) => {
      const { audience: _audience, ...remaining } = current;
      return remaining;
    });
    setSubmitted(false);
  }, [audience]);

  const updateField = (field: keyof InquiryData, value: string) => {
    setSubmitted(false);
    setData((current) => ({ ...current, [field]: value }));
    setErrors(({ [field]: _cleared, ...remaining }) => remaining);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateInquiry(data, locale, mode);
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);

    const firstInvalidField = ['audience', 'name', 'contact'].find((field) => nextErrors[field]);
    if (firstInvalidField) {
      const control = event.currentTarget.elements.namedItem(firstInvalidField);
      if (control instanceof HTMLElement) control.focus();
    }
  };

  const fieldId = (field: keyof InquiryData) => `${idPrefix}-${field}`;
  const fieldProps = (field: keyof InquiryData) => ({
    'aria-describedby': errors[field] ? `${fieldId(field)}-error` : undefined,
    'aria-invalid': Boolean(errors[field]) || undefined,
  });

  const audienceField = (
    <div className="inquiry-form__field inquiry-form__field--wide">
      <label htmlFor={fieldId('audience')}>
        <span>{copy.audience}</span>
        <select
          id={fieldId('audience')}
          name="audience"
          autoComplete="off"
          value={data.audience}
          onChange={(event) => updateField('audience', event.target.value)}
          {...fieldProps('audience')}
        >
          <option value="">{copy.audiencePlaceholder}</option>
          {(Object.entries(copy.audienceOptions) as [InquiryAudience, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      {errors.audience ? <span id={`${fieldId('audience')}-error`} role="alert">{copy.errors[errors.audience]}</span> : null}
    </div>
  );

  const contactField = (
    <div className="inquiry-form__field inquiry-form__field--wide">
      <label htmlFor={fieldId('contact')}>
        <span>{copy.contact}</span>
        <input
          id={fieldId('contact')}
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="email"
          value={data.contact}
          onChange={(event) => updateField('contact', event.target.value)}
          {...fieldProps('contact')}
        />
      </label>
      {errors.contact ? <span id={`${fieldId('contact')}-error`} role="alert">{copy.errors[errors.contact]}</span> : null}
    </div>
  );

  return (
    <form
      className={`inquiry-form inquiry-form--${mode}`}
      aria-label={accessibleName ?? copy.formLabel}
      noValidate
      onSubmit={handleSubmit}
    >
      <p className="inquiry-form__notice">{copy.preSubmitNotice}</p>
      <div className="inquiry-form__grid">
        {audienceField}
        {mode === 'full' ? (
          <>
            <div className="inquiry-form__field">
              <label htmlFor={fieldId('name')}>
                <span>{copy.name}</span>
                <input
                  id={fieldId('name')}
                  name="name"
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  value={data.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  {...fieldProps('name')}
                />
              </label>
              {errors.name ? <span id={`${fieldId('name')}-error`} role="alert">{copy.errors[errors.name]}</span> : null}
            </div>
            <label className="inquiry-form__field" htmlFor={fieldId('company')}>
              <span>{copy.company}</span>
              <input id={fieldId('company')} name="company" type="text" inputMode="text" autoComplete="organization" value={data.company} onChange={(event) => updateField('company', event.target.value)} />
            </label>
            {contactField}
          </>
        ) : contactField}
        <label className="inquiry-form__field" htmlFor={fieldId('location')}>
          <span>{copy.location}</span>
          <input id={fieldId('location')} name="location" type="text" inputMode="text" autoComplete="address-level2" value={data.location} onChange={(event) => updateField('location', event.target.value)} />
        </label>
        <label className="inquiry-form__field" htmlFor={fieldId('area')}>
          <span>{copy.area}</span>
          <input id={fieldId('area')} name="area" type="text" inputMode="decimal" autoComplete="off" value={data.area} onChange={(event) => updateField('area', event.target.value)} />
        </label>
        <label className="inquiry-form__field inquiry-form__field--wide" htmlFor={fieldId('requirements')}>
          <span>{copy.requirements}</span>
          <textarea id={fieldId('requirements')} name="requirements" autoComplete="off" rows={mode === 'compact' ? 3 : 5} value={data.requirements} onChange={(event) => updateField('requirements', event.target.value)} />
        </label>
      </div>
      <div className="inquiry-form__action">
        <button className="button button--primary" type="submit">{copy.submit}</button>
        {submitted ? <p role="status">{copy.demoNotice}</p> : null}
      </div>
    </form>
  );
}
