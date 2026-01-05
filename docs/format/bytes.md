# bytes

Human-readable byte formatting utility.

## Import

```ts
import { formatBytes } from '@regardio/js/format/bytes';
```

## Usage

### Basic Formatting

```ts
formatBytes(0);           // "0 Bytes"
formatBytes(1000);        // "1 KB"
formatBytes(1500000);     // "1.5 MB"
formatBytes(1000000000);  // "1 GB"
```

### Custom Decimals

```ts
formatBytes(1536, 0);     // "2 KB"
formatBytes(1536, 1);     // "1.5 KB"
formatBytes(1536, 3);     // "1.536 KB"
```

### File Size Display

```ts
function FileInfo({ file }: { file: File }) {
  return (
    <div>
      <span>{file.name}</span>
      <span>{formatBytes(file.size)}</span>
    </div>
  );
}
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bytes` | `number` | — | Number of bytes to format |
| `decimals` | `number` | `2` | Decimal places in output |

## Returns

| Type | Description |
|------|-------------|
| `string` | Formatted string (e.g., "1.5 MB") |

## Size Units

The function supports these units:

| Unit | Size |
|------|------|
| Bytes | 1 |
| KB | 1,000 |
| MB | 1,000,000 |
| GB | 1,000,000,000 |
| TB | 1,000,000,000,000 |
| PB | 10^15 |
| EB | 10^18 |
| ZB | 10^21 |
| YB | 10^24 |

## Base 10 vs Base 2

This implementation uses **base 10** (SI units):

- 1 KB = 1,000 bytes
- 1 MB = 1,000,000 bytes

For binary units (KiB, MiB), change `k` to `1024` in the source.

## Use Cases

- File upload progress
- Storage quota display
- Download size indicators
- Disk usage reports

## Related

- [measure](./measure.md) — Performance measurement
