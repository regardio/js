import { describe, expect, it, vi } from 'vitest';
import { urlBase64ToUint8Array } from './base64';

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
