import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  dateTimeInUnix,
  friendlyDuration,
  oneDayFromNow,
  oneMinuteFromNow,
  oneWeekFromNow,
  timeAgo,
} from './time';

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return "Just now" for very recent times', () => {
    const now = new Date();
    expect(timeAgo(now)).toBe('Just now');
  });

  test('should handle seconds ago', () => {
    const date = new Date(Date.now() - 30 * 1000);
    expect(timeAgo(date)).toMatch(/seconds? ago/);
  });

  test('should handle minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(date)).toMatch(/minutes? ago/);
  });

  test('should handle hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(timeAgo(date)).toMatch(/hours? ago/);
  });

  test('should handle days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date)).toMatch(/days? ago/);
  });

  test('should handle weeks ago', () => {
    // The implementation uses days threshold, so 14 days shows as days
    const date = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date)).toMatch(/days? ago/);
  });

  test('should handle months ago', () => {
    // The implementation uses days threshold, so 60 days shows as days
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date)).toMatch(/days? ago/);
  });

  test('should handle years ago', () => {
    // The implementation uses days threshold, so 400 days shows as days
    const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date)).toMatch(/days? ago/);
  });

  test('should accept string input', () => {
    const dateString = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(dateString)).toMatch(/minutes? ago/);
  });

  test('should handle future dates', () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 1000);
    expect(timeAgo(futureDate)).toMatch(/in \d+ minutes?/);
  });
});

describe('oneWeekFromNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return a date 7 days from now', () => {
    const result = oneWeekFromNow();
    const expected = new Date('2024-01-22T12:00:00Z');
    expect(result.getTime()).toBe(expected.getTime());
  });
});

describe('oneDayFromNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return a date 1 day from now', () => {
    const result = oneDayFromNow();
    const expected = new Date('2024-01-16T12:00:00Z');
    expect(result.getTime()).toBe(expected.getTime());
  });
});

describe('oneMinuteFromNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return a date 1 minute from now', () => {
    const result = oneMinuteFromNow();
    const expected = new Date('2024-01-15T12:01:00Z');
    expect(result.getTime()).toBe(expected.getTime());
  });
});

describe('friendlyDuration', () => {
  test('should return null for null input', () => {
    expect(friendlyDuration(null, 'en')).toBeNull();
  });

  test('should return null for 0 minutes', () => {
    expect(friendlyDuration(0, 'en')).toBeNull();
  });

  describe('short format', () => {
    test('should format minutes under 120 as minutes', () => {
      const result = friendlyDuration(70, 'en', true);
      expect(result).toEqual({
        key: 'common:duration.minutesShort',
        vars: { minutes: '70' },
      });
    });

    test('should format hours and minutes for durations over 120 minutes', () => {
      const result = friendlyDuration(150, 'en', true);
      expect(result).toEqual({
        key: 'common:duration.hoursAndMinutesShort',
        vars: { hours: '2', minutes: '30' },
      });
    });

    test('should format hours only when no remaining minutes', () => {
      const result = friendlyDuration(180, 'en', true);
      expect(result).toEqual({
        key: 'common:duration.hoursShort',
        vars: { hours: '3' },
      });
    });
  });

  describe('long format', () => {
    test('should format minutes for durations under 240 minutes', () => {
      const result = friendlyDuration(120, 'en');
      expect(result).toEqual({
        key: 'common:duration.minutes',
        vars: { count: 120, value: '120' },
      });
    });

    test('should format hours for durations 240+ minutes', () => {
      const result = friendlyDuration(240, 'en');
      expect(result).toEqual({
        key: 'common:duration.hours',
        vars: { count: 4, value: '4' },
      });
    });

    test('should format hours and minutes when there are remaining minutes', () => {
      const result = friendlyDuration(270, 'en');
      expect(result).toEqual({
        key: 'common:duration.hoursAndMinutes',
        vars: { hours: '4', minutes: '30' },
      });
    });

    test('should format days for durations 1440+ minutes', () => {
      const result = friendlyDuration(1440, 'en');
      expect(result).toEqual({
        key: 'common:duration.days',
        vars: { count: 1, value: '1' },
      });
    });

    test('should format weeks for durations 10080+ minutes', () => {
      const result = friendlyDuration(10080, 'en');
      expect(result).toEqual({
        key: 'common:duration.weeks',
        vars: { count: 1, value: '1' },
      });
    });

    test('should format months for durations 43200+ minutes', () => {
      const result = friendlyDuration(43200, 'en');
      expect(result).toEqual({
        key: 'common:duration.months',
        vars: { count: 1, value: '1' },
      });
    });

    test('should format years for durations 525600+ minutes', () => {
      const result = friendlyDuration(525600, 'en');
      expect(result).toEqual({
        key: 'common:duration.years',
        vars: { count: 1, value: '1' },
      });
    });
  });

  describe('locale formatting', () => {
    test('should use locale-specific number formatting', () => {
      // 1500 minutes = 25 hours, which is > 120 so it uses hours format
      const result = friendlyDuration(1500, 'de-DE', true);
      expect(result).toEqual({
        key: 'common:duration.hoursShort',
        vars: { hours: '25' },
      });
    });
  });
});

describe('dateTimeInUnix', () => {
  test('should convert milliseconds to seconds', () => {
    expect(dateTimeInUnix(1000)).toBe(1);
    expect(dateTimeInUnix(1500)).toBe(1);
    expect(dateTimeInUnix(2000)).toBe(2);
  });

  test('should handle 0', () => {
    expect(dateTimeInUnix(0)).toBe(0);
  });

  test('should handle large timestamps', () => {
    const timestamp = 1705320000000; // 2024-01-15T12:00:00Z
    expect(dateTimeInUnix(timestamp)).toBe(1705320000);
  });

  test('should floor the result', () => {
    expect(dateTimeInUnix(1999)).toBe(1);
    expect(dateTimeInUnix(2001)).toBe(2);
  });
});
