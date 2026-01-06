import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { measure } from './measure';

describe('measure', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should return the result of a synchronous callback', async () => {
    const result = await measure('test', () => 42);
    expect(result).toBe(42);
  });

  test('should return the result of an async callback', async () => {
    const result = await measure('test', async () => 'async result');
    expect(result).toBe('async result');
  });

  test('should log the execution time with the key', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1050);

    await measure('myOperation', () => 'result');

    expect(console.log).toHaveBeenCalledWith('myOperation took 50ms');
  });

  test('should log even if the callback throws', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1100);

    await expect(
      measure('failingOp', () => {
        throw new Error('test error');
      }),
    ).rejects.toThrow('test error');

    expect(console.log).toHaveBeenCalledWith('failingOp took 100ms');
  });

  test('should log even if async callback rejects', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1200);

    await expect(
      measure('asyncFail', () => {
        return Promise.reject(new Error('async error'));
      }),
    ).rejects.toThrow('async error');

    expect(console.log).toHaveBeenCalledWith('asyncFail took 200ms');
  });

  test('should handle callbacks returning undefined', async () => {
    const result = await measure('voidOp', () => undefined);
    expect(result).toBeUndefined();
  });

  test('should handle callbacks returning null', async () => {
    const result = await measure('nullOp', () => null);
    expect(result).toBeNull();
  });

  test('should handle callbacks returning objects', async () => {
    const obj = { foo: 'bar', num: 123 };
    const result = await measure('objectOp', () => obj);
    expect(result).toEqual(obj);
  });
});
