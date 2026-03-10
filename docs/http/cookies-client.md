# Client-Side Cookies

Browser cookie management with both async and sync APIs.

## Overview

The `@regardio/js/http` package provides two sets of client-side cookie functions:

- **Async functions** (`getCookie`, `setCookie`, etc.) - Use Cookie Store API with `document.cookie` fallback
- **Sync functions** (`getCookieSync`, `setCookieSync`, etc.) - Use `document.cookie` directly

**When to use which:**

- Use **async functions** for new code to leverage the modern Cookie Store API
- Use **sync functions** when you need synchronous access (e.g., in React components, event handlers) or want to avoid refactoring existing code to async/await

## Installation

```ts
// Async functions
import {
  getCookie,
  setCookie,
  deleteCookie,
  type CookieOptions,
} from '@regardio/js/http';

// Sync functions
import {
  getCookieSync,
  setCookieSync,
  deleteCookieSync,
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

## Synchronous Functions

### setCookieSync

Set a cookie synchronously using `document.cookie`.

```ts
setCookieSync('theme', 'dark');

setCookieSync('session', 'abc123', {
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

**Returns:** `void`

**Note:** This function is synchronous and only works in browser environments. Uses `document.cookie` directly.

### getCookieSync

Get a cookie value synchronously.

```ts
const theme = getCookieSync('theme'); // 'dark' or null
```

**Parameters:**

- `name: string` - The cookie name to retrieve

**Returns:** `string | null` - The cookie value or null if not found

**Note:** This function is synchronous and only works in browser environments.

### deleteCookieSync

Delete a cookie synchronously.

```ts
deleteCookieSync('theme', { path: '/' });
```

**Parameters:**

- `name: string` - The cookie name to delete
- `options?: Pick<CookieOptions, 'path' | 'domain'>` - Path and domain must match the original cookie

**Returns:** `void`

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

// Update theme (just set it again)
await setCookie('theme', 'light', { path: '/' });
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

### Synchronous Usage

```ts
// Set a simple cookie (no async/await needed)
setCookieSync('user', 'john');

// Get a cookie
const user = getCookieSync('user');

// Delete a cookie
deleteCookieSync('user');

// Set with options
setCookieSync('session', 'abc123', {
  path: '/',
  secure: true,
  sameSite: 'lax',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
});
```

### React Component Example

```tsx
function ThemeToggle() {
  const [theme, setTheme] = useState(() => getCookieSync('theme') ?? 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setCookieSync('theme', newTheme, { path: '/', expires: new Date('2030-01-01') });
    setTheme(newTheme);
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

## Browser Compatibility

- **Async functions** (Cookie Store API): Chrome 87+, Edge 87+, Opera 73+
- **Async functions** (fallback): All browsers via `document.cookie`
- **Sync functions**: All browsers via `document.cookie`

The async functions automatically detect and use the best available method.
