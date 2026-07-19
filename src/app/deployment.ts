function normalizedBasePath(basePath: string) {
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function assetPath(pathname: string, basePath = import.meta.env.BASE_URL) {
  return `${normalizedBasePath(basePath)}${pathname.replace(/^\/+/, '')}`;
}

export function routerBaseName(basePath = import.meta.env.BASE_URL) {
  const normalized = normalizedBasePath(basePath);
  return normalized === '/' ? undefined : normalized.slice(0, -1);
}
