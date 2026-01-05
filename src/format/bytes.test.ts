import { describe, expect, test } from 'vitest';
import { formatBytes } from './bytes';

describe('formatBytes', () => {
  test('should return "0 Bytes" for 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  test('should return "0 Bytes" for NaN', () => {
    expect(formatBytes(Number.NaN)).toBe('0 Bytes');
  });

  test('should format bytes correctly', () => {
    expect(formatBytes(1)).toBe('1 Bytes');
    expect(formatBytes(500)).toBe('500 Bytes');
    expect(formatBytes(999)).toBe('999 Bytes');
  });

  test('should format kilobytes correctly (base 10)', () => {
    expect(formatBytes(1000)).toBe('1 KB');
    expect(formatBytes(1500)).toBe('1.5 KB');
    expect(formatBytes(999000)).toBe('999 KB');
  });

  test('should format megabytes correctly', () => {
    expect(formatBytes(1000000)).toBe('1 MB');
    expect(formatBytes(1500000)).toBe('1.5 MB');
    expect(formatBytes(999000000)).toBe('999 MB');
  });

  test('should format gigabytes correctly', () => {
    expect(formatBytes(1000000000)).toBe('1 GB');
    expect(formatBytes(1500000000)).toBe('1.5 GB');
  });

  test('should format terabytes correctly', () => {
    expect(formatBytes(1000000000000)).toBe('1 TB');
  });

  test('should format petabytes correctly', () => {
    expect(formatBytes(1000000000000000)).toBe('1 PB');
  });

  test('should respect custom decimal places', () => {
    expect(formatBytes(1234, 0)).toBe('1 KB');
    expect(formatBytes(1234, 1)).toBe('1.2 KB');
    expect(formatBytes(1234, 2)).toBe('1.23 KB');
    expect(formatBytes(1234, 3)).toBe('1.234 KB');
  });

  test('should handle negative decimal places as 0', () => {
    expect(formatBytes(1234, -1)).toBe('1 KB');
    expect(formatBytes(1234, -5)).toBe('1 KB');
  });

  test('should handle large numbers', () => {
    expect(formatBytes(1e21)).toBe('1 ZB');
    expect(formatBytes(1e24)).toBe('1 YB');
  });
});
