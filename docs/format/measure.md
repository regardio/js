# measure

Performance measurement utility with automatic logging.

## Import

```ts
import { measure } from '@regardio/js/format/measure';
```

## Usage

### Basic Measurement

```ts
const result = await measure('fetchUsers', async () => {
  return await fetch('/api/users').then(r => r.json());
});
// Console: "fetchUsers took 123ms"
```

### Synchronous Functions

```ts
const result = measure('parseData', () => {
  return JSON.parse(largeJsonString);
});
// Console: "parseData took 45ms"
```

### Database Queries

```ts
const users = await measure('db.users.findMany', async () => {
  return await prisma.user.findMany({
    where: { active: true },
  });
});
```

### Multiple Measurements

```ts
async function processOrder(orderId: string) {
  const order = await measure('fetchOrder', () => getOrder(orderId));
  const inventory = await measure('checkInventory', () => checkStock(order));
  const result = await measure('processPayment', () => charge(order));

  return result;
}
// Console:
// "fetchOrder took 50ms"
// "checkInventory took 30ms"
// "processPayment took 200ms"
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | Label for the measurement |
| `callback` | `() => T \| Promise<T>` | Function to measure |

## Returns

| Type | Description |
|------|-------------|
| `Promise<T>` | Result of the callback function |

## Behavior

- Works with both sync and async functions
- Always logs timing, even if callback throws
- Returns the callback's result unchanged
- Uses `console.log` for output

## Error Handling

Timing is logged even when errors occur:

```ts
try {
  await measure('riskyOperation', async () => {
    throw new Error('Failed');
  });
} catch (error) {
  // Console still shows: "riskyOperation took 5ms"
}
```

## Use Cases

- API endpoint profiling
- Database query optimization
- Build step timing
- Debug performance issues

## Related

- [delay](../async/delay.md) — Delay utility
- [bytes](./bytes.md) — Byte formatting
