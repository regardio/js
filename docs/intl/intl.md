# @regardio/js/intl

Server-side language detection for i18n applications.

## Installation

```ts
import {
  LanguageDetector,
  LanguageDetectorLingui,
  type LanguageDetectorOption,
  type LanguageDetectorLinguiOptions,
} from '@regardio/js/intl';
```

## Classes

### LanguageDetector

Detect the user's preferred language from various sources.

```ts
const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de', 'fr'],
  fallbackLanguage: 'en',
  order: ['urlPath', 'cookie', 'session', 'searchParams', 'header'],
});

const locale = await detector.detect(request); // 'en', 'de', or 'fr'
```

**Detection order (configurable):**

1. `urlPath` - First path segment (e.g., `/de/about` → `de`)
2. `cookie` - Cookie value
3. `session` - Session storage value
4. `searchParams` - URL parameter (e.g., `?lng=de`)
5. `header` - Accept-Language header

### LanguageDetectorLingui

Wrapper for use with Lingui i18n library.

```ts
const detector = new LanguageDetectorLingui({
  detection: {
    supportedLanguages: ['en', 'de'],
    fallbackLanguage: 'en',
  },
});

const locale = await detector.getLocale(request);
```

## Options

### LanguageDetectorOption

```ts
interface LanguageDetectorOption {
  supportedLanguages: string[];
  fallbackLanguage: string;
  cookie?: Cookie; // react-router Cookie
  sessionStorage?: SessionStorage; // react-router SessionStorage
  sessionKey?: string; // default: 'lng'
  searchParamKey?: string; // default: 'lng'
  order?: Array<'urlPath' | 'searchParams' | 'cookie' | 'session' | 'header'>;
}
```
