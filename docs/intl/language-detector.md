# language-detector

Server-side language detection for internationalization, compatible with Lingui and other i18n libraries.

## Import

```ts
import { LanguageDetector, LanguageDetectorLingui } from '@regardio/js/intl/language-detector';
```

## Usage

### Basic Setup

```ts
const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de', 'fr'],
  fallbackLanguage: 'en',
});

const locale = await detector.detect(request);
```

### With Lingui

```ts
const linguiDetector = new LanguageDetectorLingui({
  detection: {
    supportedLanguages: ['en', 'de', 'fr'],
    fallbackLanguage: 'en',
  },
});

const locale = await linguiDetector.getLocale(request);
```

### With Cookie Storage

```ts
import { createCookie } from 'react-router';

const localeCookie = createCookie('locale', {
  maxAge: 60 * 60 * 24 * 365, // 1 year
});

const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de'],
  fallbackLanguage: 'en',
  cookie: localeCookie,
});
```

### With Session Storage

```ts
import { createSessionStorage } from 'react-router';

const sessionStorage = createSessionStorage({ ... });

const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de'],
  fallbackLanguage: 'en',
  sessionStorage,
  sessionKey: 'locale', // default: 'lng'
});
```

### Custom Detection Order

```ts
const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de'],
  fallbackLanguage: 'en',
  order: ['urlPath', 'cookie', 'header'], // Skip session and searchParams
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `supportedLanguages` | `string[]` | — | Languages your app supports |
| `fallbackLanguage` | `string` | — | Default when no match found |
| `cookie` | `Cookie` | — | React Router Cookie for persistence |
| `sessionStorage` | `SessionStorage` | — | React Router SessionStorage |
| `sessionKey` | `string` | `'lng'` | Key for session storage |
| `searchParamKey` | `string` | `'lng'` | URL parameter name |
| `order` | `string[]` | See below | Detection order |

## Detection Order

Default order:

1. **`urlPath`** — First URL segment (e.g., `/de/about`)
2. **`cookie`** — Stored preference
3. **`session`** — Session storage
4. **`searchParams`** — URL parameter (e.g., `?lng=de`)
5. **`header`** — Accept-Language header
6. **Fallback** — Default language

## Detection Methods

### URL Path

```text
https://example.com/de/about → 'de'
https://example.com/en/products → 'en'
```

### Search Parameters

```text
https://example.com/about?lng=de → 'de'
```

### Accept-Language Header

Parses and validates against supported languages:

```text
Accept-Language: de-DE,de;q=0.9,en;q=0.8 → 'de'
```

## In React Router

```ts
// root.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await detector.detect(request);

  return json({ locale });
}

export default function Root() {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <html lang={locale}>
      {/* ... */}
    </html>
  );
}
```

## Related

- [locale](./locale.md) — Client locale extraction
- [cookie](../http/cookie.md) — Cookie utilities
