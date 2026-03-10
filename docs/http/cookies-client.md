# Client-Side Cookies

Browser cookie management using Cookie Store API with `document.cookie` fallback.

## Overview

All client-side cookie functions use the **Cookie Store API** when available, with automatic fallback to `document.cookie` for older browsers. This provides a modern, promise-based interface while maintaining broad compatibility.

## Installation

```ts
import {
  getCookie,
  setCookie,
  updateCookie,
  deleteCookie,
  type CookieOptions,
} from '@regardio/js/http';
```

## Functions

### setCookie

Set a cookie in the browser.

```ts
await setCookie('theme', 'dark');

await setCookie('session', 'abc123', {
  expires: new Date('2025-01-01'),
  path: '/',
  sameSite: 'lax',
  secure: true,
  domain: '.example.com',
});
```

**Parameters:**

- `name: string` - The cookie name
- `value: string` - The cookie value
- `options?: CookieOptions` - Optional cookie configuration
  - `expires?: Date` - Expiration date
  - `path?: string` - Cookie path
  - `sameSite?: 'strict' | 'lax' | 'none'` - SameSite attribute
  - `secure?: boolean` - Secure flag (HTTPS only)
  - `domain?: string` - Cookie domain

**Returns:** `Promise<void>`

**Note:** Only works in browser environments. Logs a warning if called server-side.

### getCookie

Get a cookie value by name.

```ts
const theme = await getCookie('theme'); // 'dark' or null
```

**Parameters:**

- `name: string` - The cookie name to retrieve

**Returns:** `Promise<string | null>` - The cookie value or null if not found

**Note:** Only works in browser environments. Returns `null` if called server-side.

### updateCookie

Update an existing cookie (alias for `setCookie` for clarity).

```ts
await updateCookie('theme', 'light', { path: '/' });
```

**Parameters:** Same as `setCookie`

**Returns:** `Promise<void>`

### deleteCookie

Delete a cookie by name.

```ts
await deleteCookie('theme', { path: '/' });
```

**Parameters:**

- `name: string` - The cookie name to delete
- `options?: Pick<CookieOptions, 'path' | 'domain'>` - Path and domain must match the original cookie

**Returns:** `Promise<void>`

**Note:** For successful deletion, `path` and `domain` must match the values used when the cookie was set.

## Examples

### Basic Usage

```ts
// Set a simple cookie
await setCookie('user', 'john');

// Get a cookie
const user = await getCookie('user');

// Delete a cookie
await deleteCookie('user');
```

### Session Cookie with Options

```ts
await setCookie('session', 'abc123', {
  path: '/',
  secure: true,
  sameSite: 'lax',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
});
```

### Theme Preference

```ts
// Set theme
await setCookie('theme', 'dark', { path: '/', expires: new Date('2030-01-01') });

// Get theme
const theme = await getCookie('theme') ?? 'light';

// Update theme
await updateCookie('theme', 'light', { path: '/' });
```

### Cross-Domain Cookie

```ts
await setCookie('tracking', 'xyz789', {
  domain: '.example.com',
  path: '/',
  secure: true,
  sameSite: 'none',
});
```

## Browser Compatibility

- **Cookie Store API**: Chrome 87+, Edge 87+, Opera 73+
- **Fallback (`document.cookie`)**: All browsers

The functions automatically detect and use the best available method.
