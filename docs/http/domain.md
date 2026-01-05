# domain

Domain extraction from requests, with proxy awareness for reverse proxy setups.

## Import

```ts
import { createDomain } from '@regardio/js/http/domain';
```

## Usage

### Basic Usage

```ts
const domain = createDomain(request);
// Returns: "https://example.com"
```

### In Loaders/Actions

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const domain = createDomain(request);

  return json({
    sitemapUrl: `${domain}/sitemap.xml`,
    canonicalUrl: `${domain}${new URL(request.url).pathname}`,
  });
}
```

### Sitemap Generation

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const domain = createDomain(request);
  const pages = await getPages();

  const sitemap = pages.map(page => ({
    loc: `${domain}${page.path}`,
    lastmod: page.updatedAt,
  }));

  return new Response(generateSitemapXml(sitemap), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `request` | `Request` | The incoming request object |

## Returns

| Type | Description |
|------|-------------|
| `string` | Full domain URL (e.g., "<https://example.com>") |

## Proxy Awareness

The function checks for proxy headers:

1. **`x-forwarded-proto`** — Protocol from reverse proxy
2. **`host`** — Host header

This ensures correct URLs when behind:

- Nginx reverse proxy
- Load balancers
- CDN edge servers
- Cloud platforms (Vercel, Cloudflare, etc.)

## Protocol Detection

| Scenario | Result |
|----------|--------|
| Has `x-forwarded-proto` | Uses forwarded protocol |
| Localhost | Returns `http://localhost:port` |
| Production | Returns `https://host` |

## Use Cases

- Sitemap generation
- Canonical URL headers
- Open Graph meta tags
- Email links
- Webhook callbacks

## Related

- [request-helpers](./request-helpers.md) — URL utilities
- [cookie](./cookie.md) — Cookie handling
