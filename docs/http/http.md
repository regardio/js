# @regardio/js/http

HTTP, cookie, and routing utilities.

## Installation

```ts
import {
  setCookieValue,
  getCookieValue,
  createDomain,
  getCleanUrl,
  isRouteActive,
  checkIfRouteIsActive,
} from '@regardio/js/http';
```

## Functions

### setCookieValue

Set a cookie in the browser.

```ts
setCookieValue('theme', 'dark');

setCookieValue('session', 'abc123', {
  expires: new Date('2025-01-01'),
  path: '/',
  sameSite: 'Strict',
  secure: true,
  domain: '.example.com',
});
```

**Note:** Only works in browser environments. Logs a warning if called server-side.

### getCookieValue

Get a cookie value by name.

```ts
const theme = getCookieValue('theme'); // 'dark' or null
```

**Note:** Only works in browser environments. Returns `null` if called server-side.

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
