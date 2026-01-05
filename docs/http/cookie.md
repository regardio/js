# cookie

Browser cookie get/set helpers with proper encoding and security options.

## Import

```ts
import { getCookieValue, setCookieValue } from '@regardio/js/http/cookie';
```

## Usage

### Set a Cookie

```ts
setCookieValue('theme', 'dark');
```

### Set with Options

```ts
setCookieValue('session', 'abc123', {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
  path: '/',
  secure: true,
  sameSite: 'Strict',
});
```

### Get a Cookie

```ts
const theme = getCookieValue('theme');
// Returns 'dark' or null if not found
```

### User Preferences

```ts
// Save preference
function saveLanguagePreference(lang: string) {
  setCookieValue('lang', lang, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    path: '/',
  });
}

// Load preference
function getLanguagePreference(): string {
  return getCookieValue('lang') ?? 'en';
}
```

## Functions

### setCookieValue

Sets a cookie with the specified name, value, and options.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Cookie name |
| `value` | `string` | Cookie value |
| `options` | `CookieOptions` | Optional settings |

#### CookieOptions

| Option | Type | Description |
|--------|------|-------------|
| `expires` | `Date` | Expiration date |
| `path` | `string` | Cookie path |
| `sameSite` | `string` | SameSite policy |
| `secure` | `boolean` | HTTPS only |
| `domain` | `string` | Cookie domain |

### getCookieValue

Gets a cookie value by name.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Cookie name |

Returns: `string | null`

## Browser Only

These functions require `document.cookie` and will warn if called server-side.

## Security

- Values are automatically URL-encoded/decoded
- Use `secure: true` for sensitive data
- Use `sameSite: 'Strict'` or `'Lax'` to prevent CSRF
- Set appropriate `expires` to avoid persistent cookies

## Error Handling

The `setCookieValue` function catches `SecurityError` exceptions that may occur in restricted contexts (e.g., sandboxed iframes).

## Related

- [domain](./domain.md) — Domain extraction
- [language-detector](../intl/language-detector.md) — Uses cookies for language preference
