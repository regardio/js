# Server-Side Cookies

Server-side cookie handling for `Request` and `Response` objects.

## Overview

Server-side cookie functions work with standard `Request` and `Response` objects, using the battle-tested `cookie-es` library for parsing and serialization. These functions are framework-agnostic and work with any server framework (Remix, React Router, Hono, Next.js, etc.).

## Installation

```ts
import {
  parseCookies,
  serializeCookie,
  getCookieFromRequest,
  setCookieOnResponse,
  deleteCookieFromResponse,
  getAllCookiesFromRequest,
  type CookieSerializeOptions,
} from '@regardio/js/http';
```

## Functions

### parseCookies

Parse cookies from a Cookie header string.

```ts
const cookies = parseCookies('session=abc123; theme=dark');
// { session: 'abc123', theme: 'dark' }
```

**Parameters:**

- `cookieHeader: string | null | undefined` - The Cookie header value

**Returns:** `Record<string, string>` - Object with cookie name-value pairs

### serializeCookie

Serialize a cookie into a Set-Cookie header value.

```ts
const setCookieValue = serializeCookie('session', 'abc123', {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 3600,
});
// "session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600"
```

**Parameters:**

- `name: string` - The cookie name
- `value: string` - The cookie value
- `options?: CookieSerializeOptions` - Cookie configuration
  - `domain?: string` - Cookie domain
  - `encode?: (value: string) => string` - Custom encoding function
  - `expires?: Date` - Expiration date
  - `httpOnly?: boolean` - HttpOnly flag (prevents JavaScript access)
  - `maxAge?: number` - Max age in seconds
  - `path?: string` - Cookie path
  - `sameSite?: 'strict' | 'lax' | 'none' | boolean` - SameSite attribute
  - `secure?: boolean` - Secure flag (HTTPS only)

**Returns:** `string` - Set-Cookie header value

### getCookieFromRequest

Get a cookie value from a Request object.

```ts
const session = getCookieFromRequest(request, 'session');
// 'abc123' or null
```

**Parameters:**

- `request: Request` - The Request object
- `name: string` - The cookie name to retrieve

**Returns:** `string | null` - The cookie value or null if not found

### getAllCookiesFromRequest

Get all cookies from a Request object.

```ts
const allCookies = getAllCookiesFromRequest(request);
// { session: 'abc123', theme: 'dark', lang: 'en' }
```

**Parameters:**

- `request: Request` - The Request object

**Returns:** `Record<string, string>` - Object with all cookie name-value pairs

### setCookieOnResponse

Set a cookie on a Response object by adding a Set-Cookie header.

```ts
const response = setCookieOnResponse(
  new Response('OK'),
  'session',
  'abc123',
  {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  }
);
```

**Parameters:**

- `response: Response` - The Response object to modify
- `name: string` - The cookie name
- `value: string` - The cookie value
- `options?: CookieSerializeOptions` - Cookie options

**Returns:** `Response` - A new Response with the Set-Cookie header added

**Note:** This function returns a new Response object. Multiple cookies can be set by chaining calls.

### deleteCookieFromResponse

Delete a cookie on a Response object.

```ts
const response = deleteCookieFromResponse(
  new Response('OK'),
  'session',
  { path: '/' }
);
```

**Parameters:**

- `response: Response` - The Response object to modify
- `name: string` - The cookie name to delete
- `options?: Pick<CookieSerializeOptions, 'path' | 'domain'>` - Path and domain must match the original cookie

**Returns:** `Response` - A new Response with the Set-Cookie header to delete the cookie

**Note:** For successful deletion, `path` and `domain` must match the values used when the cookie was set.

## Examples

### Reading Cookies from Request

```ts
// Get a specific cookie
export async function loader({ request }: LoaderFunctionArgs) {
  const session = getCookieFromRequest(request, 'session');

  if (!session) {
    throw redirect('/login');
  }

  return { user: await getUser(session) };
}
```

### Setting Cookies on Response

```ts
// Set a session cookie
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const session = await createSession(formData);

  let response = new Response('OK');
  response = setCookieOnResponse(response, 'session', session.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
```

### Multiple Cookies

```ts
// Set multiple cookies by chaining
let response = new Response('OK');
response = setCookieOnResponse(response, 'session', 'abc123', {
  httpOnly: true,
  secure: true,
  path: '/',
});
response = setCookieOnResponse(response, 'theme', 'dark', {
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
});
```

### Deleting Cookies

```ts
export async function action({ request }: ActionFunctionArgs) {
  let response = redirect('/');
  response = deleteCookieFromResponse(response, 'session', { path: '/' });
  return response;
}
```

### Custom Cookie Parsing

```ts
// Parse cookies manually from header
const cookieHeader = request.headers.get('Cookie');
const cookies = parseCookies(cookieHeader);

if (cookies.session) {
  // Handle session
}
```

### Secure Session Cookie

```ts
const response = setCookieOnResponse(
  new Response('Logged in'),
  'session',
  sessionToken,
  {
    httpOnly: true,      // Prevent JavaScript access
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  }
);
```

## Security Best Practices

### Session Cookies

Always use these options for session cookies:

```ts
{
  httpOnly: true,   // Prevents XSS attacks
  secure: true,     // HTTPS only
  sameSite: 'lax',  // CSRF protection
  path: '/',
}
```

### Authentication Tokens

```ts
{
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}
```

### Public Preferences (theme, language)

```ts
{
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365, // 1 year
}
```

## Framework Integration

### React Router / Remix

```ts
import { getCookieFromRequest, setCookieOnResponse } from '@regardio/js/http';

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = getCookieFromRequest(request, 'theme') ?? 'light';
  return { theme };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get('theme');

  let response = redirect('/');
  response = setCookieOnResponse(response, 'theme', theme, { path: '/' });
  return response;
}
```

### Hono

```ts
import { getCookieFromRequest, setCookieOnResponse } from '@regardio/js/http';

app.get('/profile', (c) => {
  const session = getCookieFromRequest(c.req.raw, 'session');
  // ...
});

app.post('/login', async (c) => {
  const session = await createSession();
  let response = c.json({ success: true });
  response = setCookieOnResponse(response, 'session', session.id, {
    httpOnly: true,
    secure: true,
  });
  return response;
});
```
