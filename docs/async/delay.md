# delay

A Promise-based delay utility for pausing execution.

## Import

```ts
import { delay } from '@regardio/js/async/delay';
```

## Usage

### Basic Delay

```ts
await delay(1000); // Wait 1 second
console.log('1 second has passed');
```

### In Async Functions

```ts
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i < retries - 1) {
        await delay(1000 * (i + 1)); // Exponential backoff
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Animation Timing

```ts
async function animateSequence() {
  showElement1();
  await delay(300);
  showElement2();
  await delay(300);
  showElement3();
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ms` | `number` | Milliseconds to delay |

## Returns

| Type | Description |
|------|-------------|
| `Promise<void>` | Resolves after the specified delay |

## Implementation

Uses `setTimeout` wrapped in a Promise for clean async/await syntax.

## Use Cases

- Retry logic with backoff
- Animation sequencing
- Rate limiting
- Testing async behavior
- Debouncing operations

## Related

- [measure](../format/measure.md) — Performance measurement
