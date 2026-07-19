import { describe, expect, it } from 'vitest';

import { assetPath, routerBaseName } from './deployment';

describe('static deployment paths', () => {
  it('prefixes public assets when the site is served from a repository subpath', () => {
    expect(assetPath('/media/v2/home-hero.webp', '/kaidiou-premium-site/')).toBe(
      '/kaidiou-premium-site/media/v2/home-hero.webp',
    );
  });

  it('keeps public assets rooted when the site is served from the domain root', () => {
    expect(assetPath('/media/v2/home-hero.webp', '/')).toBe('/media/v2/home-hero.webp');
  });

  it('turns Vite base paths into a BrowserRouter basename', () => {
    expect(routerBaseName('/kaidiou-premium-site/')).toBe('/kaidiou-premium-site');
    expect(routerBaseName('/')).toBeUndefined();
  });
});
