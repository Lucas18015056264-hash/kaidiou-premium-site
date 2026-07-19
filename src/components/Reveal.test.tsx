import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('shows its content immediately when IntersectionObserver is unavailable', () => {
    render(
      <Reveal>
        <p>Material system</p>
      </Reveal>,
    );

    expect(screen.getByText('Material system').parentElement).toHaveClass('is-visible');
  });
});
