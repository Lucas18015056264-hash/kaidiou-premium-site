import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { AboutPage } from './AboutPage';
import { ProductDetailPage } from './ProductDetailPage';
import { ProductsPage } from './ProductsPage';
import { SolutionsPage } from './SolutionsPage';

describe('content pages', () => {
  afterEach(cleanup);

  it('keeps nano-silicon materials first in the product centre with traceable package imagery', () => {
    render(
      <MemoryRouter>
        <ProductsPage locale="zh" />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByRole('heading', { level: 2 }).slice(0, 2).map((heading) => heading.textContent),
    ).toEqual(['纳米硅标线涂料', '纳米硅着色剂']);
    expect(screen.getByRole('img', { name: '纳米硅划线漆包装图' })).toHaveAttribute(
      'src',
      '/media/v2/pack-marking.webp',
    );
  });

  it('shows product detail imagery, package material, and purchase handoff', () => {
    render(
      <MemoryRouter initialEntries={['/products/nano-silicon-marking-paint']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailPage locale="zh" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '纳米硅标线涂料' })).toBeVisible();
    expect(screen.getByRole('img', { name: '纳米硅标线涂料应用概念图' })).toHaveAttribute(
      'data-media-provenance',
      'concept-visual',
    );
    expect(screen.getByRole('img', { name: '纳米硅划线漆包装图' })).toHaveAttribute(
      'data-media-provenance',
      'company-material',
    );
    expect(screen.getByRole('heading', { level: 2, name: '索取标线材料与色样建议' })).toBeVisible();
    expect(screen.getByRole('link', { name: '提交标线询盘' })).toHaveAttribute(
      'href',
      '/contact?audience=project-owner',
    );
  });

  it('shows the colorant low-saturation palette without inventing a performance table', () => {
    render(
      <MemoryRouter initialEntries={['/products/nano-silicon-colorant']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailPage locale="zh" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 2, name: '矿物低饱和色板' })).toBeVisible();
    expect(screen.getByText('雾绿')).toBeVisible();
    expect(screen.getByText('致密基面')).toBeVisible();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders a clear 404 state for an unknown product slug', () => {
    render(
      <MemoryRouter initialEntries={['/products/unknown-material']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailPage locale="zh" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '404 | 未找到该材料' })).toBeVisible();
    expect(screen.getByRole('link', { name: '返回产品中心' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
  });

  it('gives every industry solution a challenge, recommended system, implementation focus, and consultation route', () => {
    render(
      <MemoryRouter>
        <SolutionsPage locale="zh" />
      </MemoryRouter>,
    );

    const solutions = screen.getAllByRole('article');
    expect(solutions).toHaveLength(6);
    expect(solutions.map((solution) => within(solution).getByRole('heading', { level: 2 }).textContent)).toEqual([
      '食品与饮料',
      '医药与洁净空间',
      '新能源与制造',
      '仓储与物流',
      '商业与公共空间',
      '停车场与交通标线',
    ]);
    for (const solution of solutions) {
      expect(within(solution).getByText('环境挑战')).toBeVisible();
      expect(within(solution).getByText('推荐体系')).toBeVisible();
      expect(within(solution).getByText('实施关注点')).toBeVisible();
      expect(within(solution).getByRole('link', { name: '咨询此场景' })).toHaveAttribute(
        'href',
        '/contact?audience=project-owner',
      );
    }
  });

  it('keeps the about page evidence-led without founder or client-logo claims', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutPage locale="zh" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '把地坪材料沟通放回项目现场' })).toBeVisible();
    expect(screen.getByText('内容证据说明')).toBeVisible();
    expect(container.textContent).not.toContain('创始人');
    expect(container.querySelectorAll('img, svg')).toHaveLength(0);
  });

  it('keeps the English nano-silicon pair first and the material handoff intact', () => {
    render(
      <MemoryRouter>
        <ProductsPage locale="en" />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByRole('heading', { level: 2 }).slice(0, 2).map((heading) => heading.textContent),
    ).toEqual(['Nano-Silicon Marking Paint', 'Nano-Silicon Colorant']);
  });

  it('keeps the English product-detail image, package, and enquiry path', () => {
    render(
      <MemoryRouter initialEntries={['/en/products/nano-silicon-marking-paint']}>
        <Routes>
          <Route path="/en/products/:slug" element={<ProductDetailPage locale="en" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Nano-Silicon Marking Paint' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Nano-silicon marking paint package image' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Submit marking enquiry' })).toHaveAttribute(
      'href',
      '/en/contact?audience=project-owner',
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('gives English industry solutions their complete consultation path', () => {
    render(
      <MemoryRouter>
        <SolutionsPage locale="en" />
      </MemoryRouter>,
    );

    const solutions = screen.getAllByRole('article');
    expect(solutions).toHaveLength(6);
    for (const solution of solutions) {
      expect(within(solution).getByText('Environmental challenge')).toBeVisible();
      expect(within(solution).getByText('Recommended system')).toBeVisible();
      expect(within(solution).getByText('Implementation focus')).toBeVisible();
      expect(within(solution).getByRole('link', { name: 'Discuss this setting' })).toHaveAttribute(
        'href',
        '/en/contact?audience=project-owner',
      );
    }
  });

  it('keeps the English about page evidence-led without founders or client logos', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutPage locale="en" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Put material dialogue back in the project setting.' })).toBeVisible();
    expect(screen.getByText('Content evidence note')).toBeVisible();
    expect(container.textContent).not.toMatch(/founder|client logo/i);
  });
});
