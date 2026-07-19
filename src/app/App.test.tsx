import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { App } from './App';

describe('App shell', () => {
  afterEach(cleanup);

  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
    document.title = 'Test document';
  });

  it('uses the text-only KDO / 凯迪欧 brand identity', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('link', { name: 'KDO / 凯迪欧' })).toBeInTheDocument();
    expect(container.querySelector('.brand-mark__symbol')).not.toBeInTheDocument();
  });

  it('shows a clear homepage entry for each B2B audience', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '工程甲方' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '经销商伙伴' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '海外采购商' })).toBeInTheDocument();
  });

  it('switches the homepage thesis to the real English route without storage', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'EN' }));

    expect(
      screen.getByRole('heading', { name: 'Industrial floor materials with restrained color systems' }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/en');
    expect(window.localStorage.getItem('kaidiou-locale')).toBeNull();
  });

  it('keeps the document title in sync with the selected locale', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.title).toBe('凯迪欧地坪漆 | 工业地坪材料与色彩系统');

    await user.click(screen.getByRole('button', { name: 'EN' }));

    expect(document.title).toBe('KDO Flooring Paint | Industrial Floor Materials and Color Systems');
  });

  it('derives language from the pathname for direct English and Chinese deep links', () => {
    window.history.pushState({}, '', '/en/products/nano-silicon-colorant');
    const { unmount } = render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Nano-Silicon Colorant' })).toBeVisible();
    expect(document.documentElement).toHaveAttribute('lang', 'en');

    unmount();
    window.history.pushState({}, '', '/products/nano-silicon-colorant');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '纳米硅着色剂' })).toBeVisible();
    expect(document.documentElement).toHaveAttribute('lang', 'zh-CN');
  });

  it('switches the same deep page between Chinese and English paths and preserves the query', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/contact?audience=distributor');
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(`${window.location.pathname}${window.location.search}`).toBe('/en/contact?audience=distributor');
    expect(screen.getByRole('heading', { level: 1, name: 'Start with product material and regional partnership.' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '中文' }));
    expect(`${window.location.pathname}${window.location.search}`).toBe('/contact?audience=distributor');
  });

  it('prefixes all English internal navigation links', () => {
    window.history.pushState({}, '', '/en');
    render(<App />);

    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(within(navigation).getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/en/products');
    expect(within(navigation).getByRole('link', { name: 'Applications' })).toHaveAttribute('href', '/en/solutions');
    expect(within(navigation).getByRole('link', { name: 'Enquiry' })).toHaveAttribute('href', '/en/contact');
  });

  it('renders a localized wildcard 404 with product and home recovery links', () => {
    window.history.pushState({}, '', '/en/not-a-real-route');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '404 | Page not found' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute('href', '/en/products');
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/en');
  });

  it('exposes the mobile navigation state to assistive technology', async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuButton = screen.getByRole('button', { name: '打开导航' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it.each([
    ['zh', /工程甲方/, 'project-owner', '从项目现场条件开始沟通', '请提供使用场景、地面状况、项目地点、预期时间和希望咨询的产品方向。'],
    ['zh', /经销商伙伴/, 'distributor', '从产品资料与区域合作开始', '请说明关注产品、服务区域、样品需求、客户类型与联系方式。'],
    ['zh', /海外采购商/, 'global-buyer', '从跨境采购需求开始', '请提供目标材料、样品需求、目的地、采购规格和英文联系方式。'],
    ['en', /Project Owners/, 'project-owner', 'Start with the project setting.', 'Share the application, floor condition, project location, expected timing, and product direction.'],
    ['en', /Distribution Partners/, 'distributor', 'Start with product material and regional partnership.', 'Share product interests, service region, sample needs, customer type, and contact details.'],
    ['en', /Global Buyers/, 'global-buyer', 'Start with the cross-border sourcing need.', 'Share target material, sample needs, destination, sourcing requirements, and an English-language contact.'],
  ])('routes the %s audience card to a tailored contact handoff', async (locale, role, audience, heading, description) => {
    window.history.pushState({}, '', locale === 'en' ? '/en' : '/');
    const user = userEvent.setup();
    render(<App />);

    const audienceSection = screen.getByRole('region', {
      name: locale === 'zh' ? '让不同客户更快找到下一步' : 'Give each buyer a clear next step',
    });
    await user.click(within(audienceSection).getByRole('link', { name: role }));

    expect(window.location.search).toBe(`?audience=${audience}`);
    expect(window.location.pathname).toBe(locale === 'en' ? '/en/contact' : '/contact');
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    expect(screen.getByText(description)).toBeVisible();
  });
});
