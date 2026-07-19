import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { HomePage } from './HomePage';

describe('HomePage', () => {
  afterEach(cleanup);

  it('renders the V2 image-led Chinese homepage', () => {
    render(
      <MemoryRouter>
        <HomePage locale="zh" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '工业地坪材料与低饱和色彩系统' })).toBeVisible();
    expect(screen.getByRole('img', { name: '低饱和工业地坪色彩环境概念图' })).toHaveAttribute(
      'src',
      '/media/v2/home-hero.webp',
    );
    expect(screen.getByRole('link', { name: '咨询购买' })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: '查看产品' })).toHaveAttribute('href', '/products');
  });

  it('keeps all three audience destinations visible', () => {
    render(
      <MemoryRouter>
        <HomePage locale="zh" />
      </MemoryRouter>,
    );

    const audienceSection = screen.getByRole('region', { name: '让不同客户更快找到下一步' });
    expect(within(audienceSection).getByRole('heading', { level: 3, name: '工程甲方' })).toBeVisible();
    expect(within(audienceSection).getByRole('heading', { level: 3, name: '经销商伙伴' })).toBeVisible();
    expect(within(audienceSection).getByRole('heading', { level: 3, name: '海外采购商' })).toBeVisible();
    expect(within(audienceSection).getByRole('link', { name: /工程甲方/ })).toHaveAttribute(
      'href',
      '/contact?audience=project-owner',
    );
    expect(within(audienceSection).getByRole('link', { name: /经销商伙伴/ })).toHaveAttribute(
      'href',
      '/contact?audience=distributor',
    );
    expect(within(audienceSection).getByRole('link', { name: /海外采购商/ })).toHaveAttribute(
      'href',
      '/contact?audience=global-buyer',
    );
  });

  it('prioritizes the nano-silicon pair before the rest of the product map', () => {
    render(
      <MemoryRouter>
        <HomePage locale="zh" />
      </MemoryRouter>,
    );

    const productLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('data-product-slug'));
    expect(productLinks.map((link) => link.getAttribute('data-product-slug'))).toEqual([
      'nano-silicon-marking-paint',
      'nano-silicon-colorant',
      'silicon-crystal-self-leveling',
      'colored-sand-self-leveling',
      'waterborne-pu-mortar',
    ]);
  });

  it('shows buying journeys and official information boundaries', () => {
    render(
      <MemoryRouter>
        <HomePage locale="zh" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 2, name: '购买与合作方式' })).toBeVisible();
    expect(screen.getByText('工程甲方询盘')).toBeVisible();
    expect(screen.getByText('经销商合作')).toBeVisible();
    expect(screen.getByText('海外采购')).toBeVisible();
    expect(screen.getByText(/江苏迪欧化工科技有限公司/)).toBeVisible();
    expect(screen.getByText(/400-8898-733/)).toBeVisible();
    expect(screen.getByText(/未在已整理的官方资料中发现/)).toBeVisible();
  });

  it('uses a compact enquiry form in the final homepage section', () => {
    render(
      <MemoryRouter>
        <HomePage locale="zh" />
      </MemoryRouter>,
    );

    const inquiry = screen.getByRole('region', { name: '先说清楚地面将如何被使用' });
    expect(within(inquiry).getByRole('form', { name: '提交项目需求' })).toBeVisible();
    expect(within(inquiry).getByLabelText('您的身份')).toBeVisible();
    expect(within(inquiry).getByLabelText('电话或邮箱')).toBeVisible();
    expect(within(inquiry).getByLabelText('项目地点')).toBeVisible();
    expect(within(inquiry).getByLabelText('面积')).toBeVisible();
    expect(within(inquiry).getByLabelText('需求说明')).toBeVisible();
  });

  it('renders an independent English conversion path', () => {
    render(
      <MemoryRouter>
        <HomePage locale="en" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Industrial floor materials with restrained color systems' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Start enquiry' })).toHaveAttribute('href', '/en/contact');
    expect(screen.getByRole('link', { name: 'View products' })).toHaveAttribute('href', '/en/products');
    expect(screen.getByRole('heading', { level: 3, name: 'Project Owners' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Distribution Partners' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Global Buyers' })).toBeVisible();
  });
});
