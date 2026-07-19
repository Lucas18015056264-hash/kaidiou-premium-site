import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MediaFigure } from './MediaFigure';

afterEach(() => {
  cleanup();
});

describe('MediaFigure', () => {
  it('renders a traceable concept visual with dimensions and localized copy', () => {
    render(<MediaFigure mediaId="product-marking" locale="zh" />);

    const image = screen.getByRole('img', { name: '纳米硅标线涂料应用概念图' });
    expect(image).toHaveAttribute('src', '/media/v2/product-marking.webp');
    expect(image).toHaveAttribute('data-media-provenance', 'concept-visual');
    expect(image).toHaveAttribute('data-media-role', 'atmosphere-not-case');
    expect(image).toHaveAttribute('width', '1536');
    expect(image).toHaveAttribute('height', '1024');
    expect(screen.getByText('材料应用概念视觉 · 非项目案例')).toBeVisible();
  });

  it('loads non-priority imagery lazily and keeps the homepage hero eager', () => {
    const { rerender } = render(<MediaFigure mediaId="product-marking" locale="en" />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');

    rerender(<MediaFigure mediaId="home-hero" locale="en" priority />);
    const hero = screen.getByRole('img', { name: 'Color-led industrial flooring environment' });
    expect(hero).toHaveAttribute('loading', 'eager');
    expect(hero).toHaveAttribute('fetchpriority', 'high');
  });
});
