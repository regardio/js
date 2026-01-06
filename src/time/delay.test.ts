import { describe, expect, it, vi } from 'vitest';
import { delay } from './delay';

describe('delay', () => {
  it('should return a promise', () => {
    vi.useFakeTimers();
    const result = delay(100);
    expect(result).toBeInstanceOf(Promise);
    vi.useRealTimers();
  });

  it('should resolve after the specified time', async () => {
    vi.useFakeTimers();

    const promise = delay(1000);
    vi.advanceTimersByTime(1000);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
  });

  it('should not resolve before the specified time', async () => {
    vi.useFakeTimers();

    let resolved = false;
    delay(1000).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(500);
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(500);
    await Promise.resolve(); // Flush microtasks
    expect(resolved).toBe(true);

    vi.useRealTimers();
  });

  it('should work with 0ms delay', async () => {
    vi.useFakeTimers();

    const promise = delay(0);
    vi.advanceTimersByTime(0);

    await expect(promise).resolves.toBeUndefined();

    vi.useRealTimers();
  });
});
