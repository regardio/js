export function getCleanUrl(request: Request): string {
  const url = new URL(request.url);

  url.searchParams.forEach((_, key) => {
    url.searchParams.delete(key);
  });

  return url.toString();
}
