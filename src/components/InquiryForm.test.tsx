import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { InquiryForm, validateInquiry } from './InquiryForm';

describe('InquiryForm', () => {
  afterEach(cleanup);

  it('returns locale-independent error keys for invalid enquiry details', () => {
    expect(validateInquiry({ audience: '', name: '', contact: '' }, 'zh')).toEqual({
      audience: 'audienceRequired',
      name: 'nameRequired',
      contact: 'contactInvalid',
    });
  });

  it('returns the same error keys regardless of the current locale', () => {
    expect(validateInquiry({ audience: '', name: 'Ada', contact: 'not-a-contact' }, 'en')).toEqual({
      audience: 'audienceRequired',
      contact: 'contactInvalid',
    });
  });

  it('preselects the audience passed from an existing audience query', () => {
    render(<InquiryForm locale="en" audience="global-buyer" />);

    expect(screen.getByLabelText('Your role')).toHaveValue('global-buyer');
  });

  it('shows the no-send and privacy-policy notice before submission', () => {
    render(<InquiryForm locale="zh" audience="project-owner" />);

    expect(
      screen.getByText('演示版不会发送至服务器；正式上线需补充并确认隐私政策。'),
    ).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders a compact homepage form with role, location, area, needs, and contact controls', () => {
    const compactProps = {
      locale: 'zh',
      mode: 'compact',
      idPrefix: 'home-inquiry',
    } as unknown as Parameters<typeof InquiryForm>[0];
    const { container } = render(<InquiryForm {...compactProps} />);
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    if (!form) return;

    for (const label of ['您的身份', '项目地点', '面积', '需求说明', '电话或邮箱']) {
      expect(within(form).getByLabelText(label)).toBeVisible();
    }
    expect(within(form).queryByLabelText('姓名')).not.toBeInTheDocument();
    expect(within(form).queryByLabelText('公司')).not.toBeInTheDocument();
    expect(within(form).getByText('演示版不会发送至服务器；正式上线需补充并确认隐私政策。')).toBeVisible();
  });

  it('adds submission semantics and useful browser hints to every control', () => {
    const { container } = render(<InquiryForm locale="en" />);
    const controls = [...container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];

    expect(controls).toHaveLength(7);
    for (const control of controls) {
      expect(control.name).not.toBe('');
      expect(control).toHaveAttribute('autocomplete');
    }
    expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Phone or email')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Phone or email')).toHaveAttribute('inputmode', 'email');
    expect(screen.getByLabelText('Area')).toHaveAttribute('inputmode', 'decimal');
  });

  it('focuses the first invalid field after a failed submission', async () => {
    const user = userEvent.setup();
    render(<InquiryForm locale="en" audience="project-owner" />);

    await user.click(screen.getByRole('button', { name: 'Record enquiry' }));

    expect(screen.getByLabelText('Name')).toHaveFocus();
  });

  it('updates the selected role when a new audience query reaches the contact route', () => {
    const { rerender } = render(<InquiryForm locale="en" audience="project-owner" />);

    rerender(<InquiryForm locale="en" audience="distributor" />);

    expect(screen.getByLabelText('Your role')).toHaveValue('distributor');
  });

  it('describes invalid fields and confirms that the demo does not send data to a server', async () => {
    const user = userEvent.setup();
    render(<InquiryForm locale="zh" audience="project-owner" />);

    await user.click(screen.getByRole('button', { name: '记录需求' }));

    const name = screen.getByLabelText('姓名');
    expect(name).toHaveAttribute('aria-describedby', 'inquiry-name-error');
    expect(screen.getByText('请填写姓名')).toHaveAttribute('id', 'inquiry-name-error');

    await user.type(name, '李工');
    await user.type(screen.getByLabelText('电话或邮箱'), 'li@example.com');
    await user.click(screen.getByRole('button', { name: '记录需求' }));

    expect(screen.getByRole('status')).toHaveTextContent('需求已记录，此演示版本不会发送到服务器');
  });

  it('localizes existing validation errors immediately when the locale changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<InquiryForm locale="zh" audience="project-owner" />);

    await user.click(screen.getByRole('button', { name: '记录需求' }));
    expect(screen.getByText('请填写姓名')).toBeVisible();

    rerender(<InquiryForm locale="en" audience="project-owner" />);

    expect(screen.getByText('Enter your name.')).toBeVisible();
    expect(screen.queryByText('请填写姓名')).not.toBeInTheDocument();
  });

  it('clears a corrected field error and its invalid ARIA state immediately', async () => {
    const user = userEvent.setup();
    render(<InquiryForm locale="en" audience="project-owner" />);

    await user.click(screen.getByRole('button', { name: 'Record enquiry' }));
    const name = screen.getByLabelText('Name');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter your name.')).toBeVisible();

    await user.type(name, 'Ada');

    expect(name).not.toHaveAttribute('aria-invalid');
    expect(name).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByText('Enter your name.')).not.toBeInTheDocument();
  });
});
