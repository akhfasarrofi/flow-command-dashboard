export function getQueryString(params: object = {}): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
}

export function buildPath(path: string, params: object = {}): string {
  const queryString = getQueryString(params);
  return queryString ? `${path}?${queryString}` : path;
}
