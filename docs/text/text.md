# @regardio/js/text

String manipulation and formatting utilities.

## Installation

```ts
import {
  typographicQuotes,
  toBoolean,
  replaceShyInString,
  splitIntoSentences,
  splitIntoWords,
  truncateText,
  formatBytes,
  parseAuthorString,
  type AuthorInfo,
} from '@regardio/js/text';
```

## Functions

### typographicQuotes

Replace straight quotes with typographically correct quotes for the given locale.

```ts
typographicQuotes('"Hello"', 'en'); // "Hello" (curly quotes)
typographicQuotes('"Hello"', 'de'); // „Hello" (German quotes)
typographicQuotes('"Hello"', 'fr'); // « Hello » (French guillemets)
typographicQuotes("'Hello'", 'en'); // 'Hello' (curly single quotes)
```

**Supported locales:** en, de, de-ch, fr, es, it, pt, nl, da, no, sv, fi, pl, cs, hu, ru, ja, zh

### toBoolean

Convert a string or boolean value to a boolean.

```ts
toBoolean(true); // true
toBoolean('true'); // true
toBoolean('1'); // true
toBoolean('false'); // false
toBoolean(null); // false
```

### replaceShyInString

Replace `&shy;` HTML entities with Unicode soft hyphens.

```ts
replaceShyInString('hel&shy;lo'); // 'hel\u00ADlo'
```

### splitIntoSentences

Split text into sentences by punctuation (., !, ?).

```ts
splitIntoSentences('Hello. World!'); // ['Hello.', 'World!']
```

### splitIntoWords

Split text into words by whitespace.

```ts
splitIntoWords('hello world'); // ['hello', 'world']
```

### truncateText

Truncate text to a maximum length with a suffix.

```ts
truncateText('Hello world', 8); // 'Hello...'
truncateText('Hello world', 8, '…'); // 'Hello w…'
truncateText('Hello', 10); // 'Hello' (no truncation needed)
```

### formatBytes

Format bytes as a human-readable string.

```ts
formatBytes(0); // '0 Bytes'
formatBytes(1500); // '1.5 KB'
formatBytes(1500000); // '1.5 MB'
formatBytes(1500000000); // '1.5 GB'
formatBytes(1500, 0); // '2 KB' (no decimals)
```

### parseAuthorString

Parse an author string in the format "Name \<email\> (url)".

```ts
parseAuthorString('John Doe');
// { name: 'John Doe' }

parseAuthorString('John Doe <john@example.com>');
// { name: 'John Doe', email: 'john@example.com' }

parseAuthorString('John Doe <john@example.com> (https://example.com)');
// { name: 'John Doe', email: 'john@example.com', url: 'https://example.com' }
```

## Types

### AuthorInfo

```ts
type AuthorInfo = {
  name?: string;
  email?: string;
  url?: string;
};
```
