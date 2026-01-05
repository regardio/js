# invariant

Runtime assertion utilities for type-safe error handling.

## Import

```ts
import { invariant, invariantResponse } from '@regardio/js/validation/invariant';
```

## Usage

### Basic Assertion

```ts
const user = await getUser(id);
invariant(user, 'User not found');
// After this line, TypeScript knows `user` is not null/undefined
```

### With Callback Message

```ts
invariant(user, () => `User ${id} not found`);
// Message is only computed if assertion fails
```

### HTTP Response Assertion

```ts
export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params.id);
  invariantResponse(post, 'Post not found', { status: 404 });

  return json({ post });
}
```

### Form Validation

```ts
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  invariantResponse(
    typeof email === 'string' && email.includes('@'),
    'Invalid email address',
    { status: 400 }
  );

  // email is now typed as string
}
```

## Functions

### invariant

Throws an `Error` if condition is falsy.

| Parameter | Type | Description |
|-----------|------|-------------|
| `condition` | `unknown` | Value to check |
| `message` | `string \| (() => string)` | Error message |

Throws: `Error`

### invariantResponse

Throws a `Response` if condition is falsy.

| Parameter | Type | Description |
|-----------|------|-------------|
| `condition` | `unknown` | Value to check |
| `message` | `string \| (() => string)` | Response body |
| `responseInit` | `ResponseInit` | Response options |

Throws: `Response` (default status: 400)

## Type Narrowing

Both functions use TypeScript's `asserts` keyword:

```ts
function processUser(user: User | null) {
  invariant(user, 'User required');
  // TypeScript now knows: user is User (not null)
  console.log(user.name); // OK
}
```

## Response Init Options

```ts
invariantResponse(condition, 'Not found', {
  status: 404,
  statusText: 'Not Found',
  headers: {
    'X-Error-Code': 'USER_NOT_FOUND',
  },
});
```

## Comparison with tiny-invariant

Unlike `tiny-invariant`, these functions:

- Include the message in production builds
- Support callback messages for lazy evaluation
- Provide a Response-throwing variant

## Use Cases

- Loader/action guards
- Form validation
- API response validation
- Type narrowing
- Development assertions

## Related

- [verify-file-accept](./verify-file-accept.md) — File validation
