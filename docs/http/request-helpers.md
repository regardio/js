# request-helpers

URL cleaning utilities for request handling.

## Import

```ts
import { getCleanUrl } from '@regardio/js/http/request-helpers';
```

## Usage

### Basic Usage

```ts
// Request URL: https://example.com/page?utm_source=twitter&ref=123
const cleanUrl = getCleanUrl(request);
// Returns: "https://example.com/page"
```

### Canonical URLs

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const canonicalUrl = getCleanUrl(request);

  return json({
    meta: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  });
}
```

### Cache Keys

```ts
async function getCachedData(request: Request) {
  const cacheKey = getCleanUrl(request);

  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const data = await fetchData();
  await cache.set(cacheKey, data);
  return data;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `request` | `Request` | The incoming request object |

## Returns

| Type | Description |
|------|-------------|
| `string` | URL without search parameters |

## Behavior

The function:

1. Parses the request URL
2. Removes all search parameters
3. Returns the clean URL string

## Use Cases

- Canonical URL generation
- Cache key creation
- Analytics normalization
- URL comparison
- Redirect targets

## Example Transformations

| Input | Output |
|-------|--------|
| `https://example.com/page?a=1&b=2` | `https://example.com/page` |
| `https://example.com/?utm_source=x` | `https://example.com/` |
| `https://example.com/path` | `https://example.com/path` |

## Related

- [domain](./domain.md) — Domain extraction
