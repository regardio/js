import { describe, expect, test } from 'vitest';
import { invariant, invariantResponse } from './invariant';

describe('invariant', () => {
  test('should not throw when condition is truthy', () => {
    expect(() => invariant(true, 'error')).not.toThrow();
    expect(() => invariant(1, 'error')).not.toThrow();
    expect(() => invariant('string', 'error')).not.toThrow();
    expect(() => invariant({}, 'error')).not.toThrow();
    expect(() => invariant([], 'error')).not.toThrow();
  });

  test('should throw Error when condition is falsy', () => {
    expect(() => invariant(false, 'test error')).toThrow(Error);
    expect(() => invariant(false, 'test error')).toThrow('test error');
  });

  test('should throw for various falsy values', () => {
    expect(() => invariant(null, 'null error')).toThrow('null error');
    expect(() => invariant(undefined, 'undefined error')).toThrow('undefined error');
    expect(() => invariant(0, 'zero error')).toThrow('zero error');
    expect(() => invariant('', 'empty string error')).toThrow('empty string error');
    expect(() => invariant(Number.NaN, 'NaN error')).toThrow('NaN error');
  });

  test('should accept message as a function', () => {
    expect(() => invariant(false, () => 'lazy error')).toThrow('lazy error');
  });

  test('should not call message function when condition is truthy', () => {
    let called = false;
    invariant(true, () => {
      called = true;
      return 'error';
    });
    expect(called).toBe(false);
  });

  test('should work as type assertion', () => {
    const value: string | null = 'hello';
    invariant(value !== null, 'value is null');
    // TypeScript should now know value is string
    expect(value.toUpperCase()).toBe('HELLO');
  });
});

describe('invariantResponse', () => {
  test('should not throw when condition is truthy', () => {
    expect(() => invariantResponse(true, 'error')).not.toThrow();
    expect(() => invariantResponse(1, 'error')).not.toThrow();
    expect(() => invariantResponse('string', 'error')).not.toThrow();
  });

  test('should throw Response when condition is falsy', () => {
    expect(() => invariantResponse(false, 'test error')).toThrow();
  });

  test('should throw Response with status 400 by default', async () => {
    let thrownError: unknown;
    try {
      invariantResponse(false as boolean, 'bad request');
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toBeInstanceOf(Response);
    const response = thrownError as Response;
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('bad request');
  });

  test('should accept custom responseInit', () => {
    let thrownError: unknown;
    try {
      invariantResponse(false as boolean, 'not found', { status: 404 });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toBeInstanceOf(Response);
    const response = thrownError as Response;
    expect(response.status).toBe(404);
  });

  test('should accept custom headers in responseInit', () => {
    let thrownError: unknown;
    try {
      invariantResponse(false as boolean, 'error', {
        headers: { 'X-Custom-Header': 'value' },
      });
    } catch (error) {
      thrownError = error;
    }
    const response = thrownError as Response;
    expect(response.headers.get('X-Custom-Header')).toBe('value');
  });

  test('should accept message as a function', async () => {
    let thrownError: unknown;
    try {
      invariantResponse(false as boolean, () => 'lazy error');
    } catch (error) {
      thrownError = error;
    }
    const response = thrownError as Response;
    expect(await response.text()).toBe('lazy error');
  });

  test('should not call message function when condition is truthy', () => {
    let called = false;
    invariantResponse(true, () => {
      called = true;
      return 'error';
    });
    expect(called).toBe(false);
  });

  test('should work as type assertion', () => {
    const value: string | null = 'hello';
    invariantResponse(value !== null, 'value is null');
    // TypeScript should now know value is string
    expect(value.toUpperCase()).toBe('HELLO');
  });
});
