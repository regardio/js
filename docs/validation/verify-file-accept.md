# verify-file-accept

MIME type validation for file uploads against accept patterns.

## Import

```ts
import { verifyAccept } from '@regardio/js/validation/verify-file-accept';
```

## Usage

### Basic Validation

```ts
verifyAccept('image/png', 'image/*');     // true
verifyAccept('image/jpeg', 'image/*');    // true
verifyAccept('video/mp4', 'image/*');     // false
```

### Exact Match

```ts
verifyAccept('image/png', 'image/png');   // true
verifyAccept('image/jpeg', 'image/png');  // false
```

### Multiple Types

```ts
verifyAccept('image/png', 'image/png,image/jpeg');  // true
verifyAccept('image/gif', 'image/png,image/jpeg');  // false
verifyAccept('video/mp4', 'image/*,video/*');       // true
```

### File Upload Validation

```ts
function validateFile(file: File, accept: string): boolean {
  return verifyAccept(file.type, accept);
}

// Usage
const file = event.target.files[0];
if (!validateFile(file, 'image/*')) {
  alert('Please upload an image file');
}
```

### Form Handler

```ts
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get('avatar') as File;

  if (!verifyAccept(file.type, 'image/png,image/jpeg,image/webp')) {
    return json({ error: 'Invalid file type' }, { status: 400 });
  }

  // Process file...
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `string` | MIME type to test (e.g., "image/png") |
| `accept` | `string` | Accepted types (e.g., "image/*,video/*") |

## Returns

| Type | Description |
|------|-------------|
| `boolean` | `true` if type is accepted |

## Accept Patterns

| Pattern | Matches |
|---------|---------|
| `image/*` | Any image type |
| `video/*` | Any video type |
| `audio/*` | Any audio type |
| `image/png` | Only PNG images |
| `image/png,image/jpeg` | PNG or JPEG |
| `image/*,video/*` | Any image or video |

## Matching Logic

1. Exact match: `image/png` matches `image/png`
2. Wildcard match: `image/png` matches `image/*`
3. Multiple patterns: Comma-separated, any match succeeds

## Use Cases

- File upload validation
- Drag-and-drop file filtering
- Form input validation
- API file type checking

## Related

- [invariant](./invariant.md) — Assertion utilities
