# @regardio/js

> **TypeScript utilities for Regardio applications**

A collection of lightweight, tree-shakeable utility functions for common tasks
like HTTP handling, internationalization, time formatting, and validation.

## Installation

```bash
pnpm add @regardio/js
```

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

## License

**MIT License** - Free to use in commercial and open source projects.

---

*Part of the [Regardio Ensemble](https://regard.io/ensemble) toolkit for
collective well-being.*
