# @regardio/js/time

Date, time, and async utilities.

## Installation

```ts
import {
  timeAgo,
  oneWeekFromNow,
  oneDayFromNow,
  oneMinuteFromNow,
  friendlyDuration,
  dateTimeInUnix,
  delay,
  measure,
} from '@regardio/js/time';
```

## Functions

### timeAgo

Format a date as a relative time string (e.g., "3 days ago").

```ts
timeAgo(new Date('2024-01-01')); // "3 months ago"
timeAgo('2024-01-01'); // Also accepts ISO strings
```

### oneWeekFromNow / oneDayFromNow / oneMinuteFromNow

Get a Date object for a future time.

```ts
const expires = oneWeekFromNow();
const tomorrow = oneDayFromNow();
const soon = oneMinuteFromNow();
```

### friendlyDuration

Format a duration in minutes as a localized string with i18n keys.

```ts
friendlyDuration(150, 'en', true);
// { key: 'common:duration.hoursAndMinutesShort', vars: { hours: '2', minutes: '30' } }

friendlyDuration(1440, 'en');
// { key: 'common:duration.days', vars: { count: 1, value: '1' } }
```

### dateTimeInUnix

Convert a JavaScript timestamp to Unix timestamp (seconds).

```ts
dateTimeInUnix(Date.now()); // Unix timestamp in seconds
```

### delay

Promise-based delay utility.

```ts
await delay(1000); // Wait 1 second
await delay(500); // Wait 500ms
```

### measure

Measure and log the execution time of a function.

```ts
const result = await measure('fetchData', async () => {
  return await fetch('/api/data');
});
// Logs: "fetchData took 123ms"
```
