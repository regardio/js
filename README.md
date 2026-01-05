# @regardio/js

> **TypeScript utilities for Regardio applications**

A collection of lightweight, tree-shakeable utility functions for common tasks
like HTTP handling, internationalization, time formatting, and validation.

## ⚠️ Pre-release Notice

**This package is currently in pre-release (v0.x).** While we use these utilities in production across our own projects, the API may still change between minor versions. We recommend:

- Pinning to exact versions in your `package.json`
- Reviewing changelogs before upgrading
- Expecting potential breaking changes until v1.0

## Why This Package?

We created `@regardio/js` to:

- **Share battle-tested utilities** — These functions power real Regardio projects and have been refined through actual use
- **Reduce boilerplate** — Common patterns like cookie handling, language detection, and time formatting in one place
- **Stay framework-agnostic** — Works with any JavaScript/TypeScript project (React, Node, Deno, etc.)
- **Enable tree-shaking** — Import only what you need; unused utilities won't bloat your bundle

## Installation

```bash
pnpm add @regardio/js
```

## Documentation

See the [docs](./docs) folder for detailed documentation on each module.

## Modules

### async/delay

Promise-based delay utility.

```ts
import { delay } from '@regardio/js/async/delay';

await delay(1000); // Wait 1 second
```

### browser/base64

URL-safe base64 to Uint8Array conversion (useful for Web Push).

```ts
import { urlBase64ToUint8Array } from '@regardio/js/browser/base64';

const bytes = urlBase64ToUint8Array(vapidPublicKey);
```

### format/bytes

Human-readable byte formatting.

```ts
import { formatBytes } from '@regardio/js/format/bytes';

formatBytes(1500000); // "1.5 MB"
```

### format/measure

Performance measurement with logging.

```ts
import { measure } from '@regardio/js/format/measure';

const result = await measure('fetchData', async () => {
  return await fetch('/api/data');
});
// Logs: "fetchData took 123ms"
```

### http/cookie

Browser cookie get/set helpers.

```ts
import { getCookieValue, setCookieValue } from '@regardio/js/http/cookie';

setCookieValue('theme', 'dark', { path: '/', secure: true });
const theme = getCookieValue('theme');
```

### http/domain

Domain extraction from requests (proxy-aware).

```ts
import { createDomain } from '@regardio/js/http/domain';

const domain = createDomain(request); // "https://example.com"
```

### http/request-helpers

URL cleaning utilities.

```ts
import { getCleanUrl } from '@regardio/js/http/request-helpers';

getCleanUrl(request); // URL without search params
```

### intl/language-detector

Server-side language detection for i18n (works with Lingui).

```ts
import { LanguageDetector } from '@regardio/js/intl/language-detector';

const detector = new LanguageDetector({
  supportedLanguages: ['en', 'de'],
  fallbackLanguage: 'en',
});

const locale = await detector.detect(request);
```

### intl/locale

Client locale extraction from Accept-Language header.

```ts
import { getClientLocales } from '@regardio/js/intl/locale';

const locales = getClientLocales(request); // ['en-US', 'de']
```

### time/time

Time formatting utilities.

```ts
import { timeAgo, friendlyDuration, oneWeekFromNow } from '@regardio/js/time/time';

timeAgo(new Date('2024-01-01')); // "3 months ago"
friendlyDuration(150, 'en', true); // { key: 'common:duration.hoursAndMinutesShort', vars: {...} }
const expires = oneWeekFromNow();
```

### validation/invariant

Runtime assertion utilities.

```ts
import { invariant, invariantResponse } from '@regardio/js/validation/invariant';

invariant(user, 'User not found'); // Throws Error if falsy
invariantResponse(user, 'User not found', { status: 404 }); // Throws Response if falsy
```

### validation/verify-file-accept

MIME type validation for file uploads.

```ts
import { verifyAccept } from '@regardio/js/validation/verify-file-accept';

verifyAccept('image/png', 'image/*'); // true
verifyAccept('video/mp4', 'image/*'); // false
```

## Module Overview

| Module | Description |
|--------|-------------|
| `async/delay` | Promise-based delay utility |
| `browser/base64` | URL-safe base64 to Uint8Array conversion |
| `format/bytes` | Human-readable byte formatting |
| `format/measure` | Performance measurement with logging |
| `http/cookie` | Browser cookie get/set helpers |
| `http/domain` | Domain extraction from requests (proxy-aware) |
| `http/request-helpers` | URL cleaning utilities |
| `intl/language-detector` | Server-side language detection for i18n |
| `intl/locale` | Client locale extraction from headers |
| `time/time` | Time formatting and date utilities |
| `validation/invariant` | Runtime assertion utilities |
| `validation/verify-file-accept` | MIME type validation for file uploads |

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
