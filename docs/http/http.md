# @regardio/js/http

HTTP, cookie, and routing utilities for both client and server environments.

## Quick Start

```ts
import {
  // Client-side cookies
  getCookie,
  setCookie,
  updateCookie,
  deleteCookie,
  // Server-side cookies
  getCookieFromRequest,
  setCookieOnResponse,
  parseCookies,
  serializeCookie,
  // HTTP utilities
  createDomain,
  getCleanUrl,
  isRouteActive,
} from '@regardio/js/http';
```

## Documentation

### Cookies

- **[Client-Side Cookies](./cookies-client.md)** - Browser cookie management using Cookie Store API with `document.cookie` fallback
  - `getCookie()`, `setCookie()`, `updateCookie()`, `deleteCookie()`
  - Promise-based API
  - Works in all browsers

- **[Server-Side Cookies](./cookies-server.md)** - Request/Response cookie handling for server frameworks
  - `getCookieFromRequest()`, `setCookieOnResponse()`, `deleteCookieFromResponse()`
  - `parseCookies()`, `serializeCookie()`, `getAllCookiesFromRequest()`
  - Framework-agnostic (Remix, React Router, Hono, Next.js, etc.)
  - Includes security best practices and examples

## HTTP Utilities

### createDomain

Extract the domain from a request, handling proxies correctly.

```ts
const domain = createDomain(request);
// "https://example.com" (respects x-forwarded-proto header)
```

### getCleanUrl

Get a URL without search parameters.

```ts
getCleanUrl(request); // "https://example.com/path" (no query string)
```

### isRouteActive

Check if a route is active, useful for navigation highlighting.

```ts
isRouteActive('/home', '/home'); // true (exact match)
isRouteActive('/account', '/account/settings'); // false (default: exact match)
isRouteActive('/account', '/account/settings', false); // true (partial match)

// Custom end function
isRouteActive('/account', '/account/settings', (path) => path.includes('settings'));
```

### checkIfRouteIsActive

Lower-level route matching with configurable depth.

```ts
checkIfRouteIsActive('/account', '/account/settings', 1); // false
checkIfRouteIsActive('/account', '/account/settings', 2); // true
checkIfRouteIsActive('/home', '/home?foo=bar'); // true (ignores query params)
```
