# @regardio/js/assert

Runtime assertion and validation utilities.

## Installation

```ts
import { invariant, invariantResponse, verifyAccept } from '@regardio/js/assert';
```

## Functions

### invariant

Assert a condition and throw an Error if falsy.

```ts
invariant(user, 'User not found');
// Throws: Error('User not found') if user is falsy

invariant(typeof value === 'string', () => `Expected string, got ${typeof value}`);
// Supports lazy message evaluation
```

**TypeScript:** Narrows the type after the assertion.

```ts
function getUser(id: string): User | null { ... }

const user = getUser('123');
invariant(user, 'User not found');
// user is now typed as User (not User | null)
```

### invariantResponse

Assert a condition and throw a Response if falsy (useful in loaders/actions).

```ts
invariantResponse(user, 'User not found');
// Throws: Response with status 400

invariantResponse(user, 'User not found', { status: 404 });
// Throws: Response with status 404

invariantResponse(isAdmin, 'Forbidden', { status: 403 });
```

### verifyAccept

Check if a MIME type matches an accept pattern.

```ts
verifyAccept('image/png', 'image/*'); // true
verifyAccept('image/png', 'image/png'); // true
verifyAccept('video/mp4', 'image/*'); // false
verifyAccept('image/png', 'image/png,image/jpeg'); // true
```

Useful for validating file uploads against accept attributes.
