# @regardio/js

> **TypeScript utilities for Regardio applications**

A collection of lightweight, tree-shakeable utility functions for common tasks
like text manipulation, HTTP handling, internationalization, time formatting, and validation.

## ⚠️ Pre-release Notice

**This package is currently in pre-release (v0.x).** While we use these utilities in production across our own projects, the API may still change between minor versions. We recommend:

- Pinning to exact versions in your `package.json`
- Reviewing changelogs before upgrading
- Expecting potential breaking changes until v1.0

## Why This Package?

We created `@regardio/js` to:

- **Share battle-tested utilities** — These functions power real Regardio projects and have been refined through actual use
- **Reduce boilerplate** — Common patterns like text formatting, cookie handling, language detection, and time formatting in one place
- **Stay framework-agnostic** — Works with any JavaScript/TypeScript project (React, Node, Deno, etc.)
- **Enable tree-shaking** — Import only what you need; unused utilities won't bloat your bundle

## Installation

```bash
pnpm add @regardio/js
```

## Modules

### @regardio/js/text

String manipulation and formatting utilities.

```ts
import {
  typographicQuotes,
  truncateText,
  splitIntoSentences,
  formatBytes,
  parseAuthorString,
} from '@regardio/js/text';

typographicQuotes('"Hello"', 'de'); // „Hello"
truncateText('Hello world', 8); // "Hello..."
formatBytes(1500000); // "1.5 MB"
parseAuthorString('John <john@example.com>'); // { name: 'John', email: 'john@example.com' }
```

### @regardio/js/time

Date, time, and async utilities.

```ts
import {
  timeAgo,
  friendlyDuration,
  oneWeekFromNow,
  delay,
  measure,
} from '@regardio/js/time';

timeAgo(new Date('2024-01-01')); // "3 months ago"
friendlyDuration(150, 'en', true); // { key: 'common:duration.hoursAndMinutesShort', vars: {...} }
await delay(1000); // Wait 1 second
await measure('fetchData', () => fetch('/api')); // Logs timing
```

### @regardio/js/http

HTTP, cookie, and routing utilities.

```ts
import {
  getCookieValue,
  setCookieValue,
  createDomain,
  getCleanUrl,
  isRouteActive,
} from '@regardio/js/http';

setCookieValue('theme', 'dark', { path: '/', secure: true });
const theme = getCookieValue('theme');
const domain = createDomain(request); // "https://example.com"
isRouteActive('/account', '/account/settings', false); // true
```

### @regardio/js/intl

Server-side language detection for i18n.

```ts
import { LanguageDetector } from '@regardio/js/intl';

const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de'],
  fallbackLanguage: 'en',
});

const locale = await detector.detect(request);
```

### @regardio/js/assert

Runtime assertion and validation utilities.

```ts
import { invariant, invariantResponse, verifyAccept } from '@regardio/js/assert';

invariant(user, 'User not found'); // Throws Error if falsy
invariantResponse(user, 'User not found', { status: 404 }); // Throws Response
verifyAccept('image/png', 'image/*'); // true
```

### @regardio/js/encoding

Binary encoding utilities.

```ts
import { urlBase64ToUint8Array } from '@regardio/js/encoding';

const bytes = urlBase64ToUint8Array(vapidPublicKey);
```

## Module Overview

| Module | Description |
|--------|-------------|
| `@regardio/js/text` | String manipulation, formatting, author parsing |
| `@regardio/js/time` | Time formatting, delays, performance measurement |
| `@regardio/js/http` | Cookies, domain extraction, route matching |
| `@regardio/js/intl` | Server-side language detection for i18n |
| `@regardio/js/assert` | Runtime assertions and MIME validation |
| `@regardio/js/encoding` | Base64 and binary conversions |

## Contributing

This package is primarily maintained for Regardio's internal use, but we welcome:

- Bug reports and fixes
- Documentation improvements
- Feature suggestions (though we may not implement all requests)

## License

**MIT License** — Free to use in commercial and open source projects.

---

*Part of the [Regardio Ensemble](https://regard.io/ensemble) toolkit for
collective well-being.*
