import { describe, expect, test, vi } from 'vitest';
import { delay } from './delay';

describe('delay', () => {
  test('should return a promise', () => {
    const result = delay(0);
    expect(result).toBeInstanceOf(Promise);
  });

  test('should resolve after the specified time', async () => {
    vi.useFakeTimers();

    const promise = delay(100);
    vi.advanceTimersByTime(100);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
  });

  test('should not resolve before the specified time', async () => {
    vi.useFakeTimers();

    let resolved = false;
    delay(100).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(50);
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(50);
    await Promise.resolve(); // flush microtasks
    expect(resolved).toBe(true);

    vi.useRealTimers();
  });

  test('should work with 0ms delay', async () => {
    vi.useFakeTimers();

    const promise = delay(0);
    vi.advanceTimersByTime(0);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
  });
});
