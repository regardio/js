# locale

Client locale extraction from Accept-Language headers.

## Import

```ts
import { getClientLocales } from '@regardio/js/intl/locale';
```

## Usage

### From Request

```ts
const locales = getClientLocales(request);
// Returns: ['en-US', 'en', 'de'] or undefined
```

### From Headers

```ts
const locales = getClientLocales(request.headers);
// Returns: ['en-US', 'en', 'de'] or undefined
```

### In Loaders

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const locales = getClientLocales(request);
  const preferredLocale = locales?.[0] ?? 'en';

  return json({
    locale: preferredLocale,
  });
}
```

### Date Formatting

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const locales = getClientLocales(request);
  const locale = locales?.[0] ?? 'en';

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  });

  return json({
    formattedDate: formatter.format(new Date()),
  });
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `requestOrHeaders` | `Request \| Headers` | Request or Headers object |

## Returns

| Type | Description |
|------|-------------|
| `string \| string[] \| undefined` | Locales sorted by preference |

## Return Values

- **`undefined`** — No Accept-Language header
- **`string`** — Single locale
- **`string[]`** — Multiple locales, ordered by quality value

## Accept-Language Parsing

The header is parsed respecting quality values:

```text
Accept-Language: en-US,en;q=0.9,de;q=0.8

Result: ['en-US', 'en', 'de']
```

## Validation

Locales are validated using `Intl.DateTimeFormat.supportedLocalesOf()`, ensuring only valid locale strings are returned.

## Use Cases

- Locale-aware formatting
- Content negotiation
- User preference detection
- Fallback language selection

## Related

- [language-detector](./language-detector.md) — Full language detection
- [time](../time/time.md) — Time formatting
