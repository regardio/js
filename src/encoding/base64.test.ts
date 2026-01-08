import { describe, expect, it, vi } from 'vitest';
import { generateRandomBase64, urlBase64ToUint8Array } from './base64';

describe('urlBase64ToUint8Array', () => {
  it('should convert a base64 string to Uint8Array', () => {
    // Mock window.atob for Node.js environment
    vi.stubGlobal('window', {
      atob: (str: string) => Buffer.from(str, 'base64').toString('binary'),
    });

    const base64 = 'SGVsbG8'; // "Hello" in base64
    const result = urlBase64ToUint8Array(base64);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(5);
    expect(String.fromCharCode(...result)).toBe('Hello');

    vi.unstubAllGlobals();
  });

  it('should handle URL-safe base64 characters', () => {
    vi.stubGlobal('window', {
      atob: (str: string) => Buffer.from(str, 'base64').toString('binary'),
    });

    // URL-safe base64 uses - and _ instead of + and /
    const urlSafeBase64 = 'SGVs-G8_'; // Contains - and _
    const result = urlBase64ToUint8Array(urlSafeBase64);

    expect(result).toBeInstanceOf(Uint8Array);

    vi.unstubAllGlobals();
  });

  it('should add padding if needed', () => {
    vi.stubGlobal('window', {
      atob: (str: string) => Buffer.from(str, 'base64').toString('binary'),
    });

    // Base64 without padding
    const base64NoPadding = 'SGVsbG8'; // Should be SGVsbG8=
    const result = urlBase64ToUint8Array(base64NoPadding);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(5);

    vi.unstubAllGlobals();
  });

  it('should handle empty string', () => {
    vi.stubGlobal('window', {
      atob: () => '',
    });

    const result = urlBase64ToUint8Array('');

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(0);

    vi.unstubAllGlobals();
  });
});

describe('generateRandomBase64', () => {
  it('should return a base64 string', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = i;
        }
        return array;
      },
    });
    vi.stubGlobal('btoa', (str: string) => Buffer.from(str, 'binary').toString('base64'));

    const result = generateRandomBase64();

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);

    vi.unstubAllGlobals();
  });

  it('should return a string of expected length for 16 bytes', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = i;
        }
        return array;
      },
    });
    vi.stubGlobal('btoa', (str: string) => Buffer.from(str, 'binary').toString('base64'));

    const result = generateRandomBase64();

    // 16 bytes = 128 bits, base64 encodes 6 bits per char, so ~22 chars + padding = 24
    expect(result.length).toBe(24);

    vi.unstubAllGlobals();
  });

  it('should produce different values on subsequent calls', () => {
    let callCount = 0;
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = (i + callCount * 16) % 256;
        }
        callCount++;
        return array;
      },
    });
    vi.stubGlobal('btoa', (str: string) => Buffer.from(str, 'binary').toString('base64'));

    const result1 = generateRandomBase64();
    const result2 = generateRandomBase64();

    expect(result1).not.toBe(result2);

    vi.unstubAllGlobals();
  });

  it('should produce valid base64 characters only', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
    });
    vi.stubGlobal('btoa', (str: string) => Buffer.from(str, 'binary').toString('base64'));

    const result = generateRandomBase64();

    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);

    vi.unstubAllGlobals();
  });
});
