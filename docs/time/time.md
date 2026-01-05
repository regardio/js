# time

Time formatting utilities including relative time, durations, and date helpers.

## Import

```ts
import {
  timeAgo,
  friendlyDuration,
  oneWeekFromNow,
  oneDayFromNow,
  oneMinuteFromNow,
  dateTimeInUnix,
} from '@regardio/js/time/time';
```

## Usage

### Relative Time

```ts
timeAgo(new Date('2024-01-01'));
// "3 months ago"

timeAgo(new Date(Date.now() - 60000));
// "1 minute ago"

timeAgo(new Date(Date.now() - 5000));
// "Just now"
```

### Friendly Duration

```ts
// Short format
friendlyDuration(90, 'en', true);
// { key: 'common:duration.minutesShort', vars: { minutes: '90' } }

friendlyDuration(150, 'en', true);
// { key: 'common:duration.hoursAndMinutesShort', vars: { hours: '2', minutes: '30' } }

// Long format
friendlyDuration(1440, 'en', false);
// { key: 'common:duration.days', vars: { count: 1, value: '1' } }
```

### Date Helpers

```ts
const weekExpiry = oneWeekFromNow();
const dayExpiry = oneDayFromNow();
const minuteExpiry = oneMinuteFromNow();

// Unix timestamp
const unix = dateTimeInUnix(Date.now());
// 1704067200
```

## Functions

### timeAgo

Formats a date as relative time (e.g., "3 days ago").

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Date \| string` | Date to format |

Returns: `string`

### friendlyDuration

Formats minutes as a human-readable duration with i18n support.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `minutes` | `number \| null` | — | Duration in minutes |
| `locale` | `string` | — | Locale for number formatting |
| `short` | `boolean` | `false` | Use short format |

Returns: `{ key: string; vars: object } | null`

### oneWeekFromNow / oneDayFromNow / oneMinuteFromNow

Returns a Date object for the specified time in the future.

Returns: `Date`

### dateTimeInUnix

Converts milliseconds to Unix timestamp (seconds).

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | `number` | Timestamp in milliseconds |

Returns: `number`

## Duration Keys

The `friendlyDuration` function returns translation keys:

| Key | Example |
|-----|---------|
| `common:duration.minutesShort` | 90' |
| `common:duration.hoursShort` | 2h |
| `common:duration.hoursAndMinutesShort` | 2h 30' |
| `common:duration.minutes` | 90 minutes |
| `common:duration.hours` | 2 hours |
| `common:duration.hoursAndMinutes` | 2 hours and 30 minutes |
| `common:duration.days` | 1 day |
| `common:duration.weeks` | 2 weeks |
| `common:duration.months` | 3 months |
| `common:duration.years` | 1 year |

## Use Cases

- Comment timestamps
- Cookie expiration
- Session timeouts
- Event countdowns
- Activity feeds

## Related

- [locale](../intl/locale.md) — Locale utilities
- [delay](../async/delay.md) — Async delay
