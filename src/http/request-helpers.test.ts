import { describe, expect, test } from 'vitest';
import { getCleanUrl } from './request-helpers';

describe('getCleanUrl', () => {
  test('should return URL without search params', () => {
    const request = new Request('https://example.com/path?foo=bar');
    expect(getCleanUrl(request)).toBe('https://example.com/path');
  });

  test('should return URL unchanged if no search params', () => {
    const request = new Request('https://example.com/path');
    expect(getCleanUrl(request)).toBe('https://example.com/path');
  });

  test('should preserve the path', () => {
    const request = new Request('https://example.com/some/deep/path?param=value');
    expect(getCleanUrl(request)).toBe('https://example.com/some/deep/path');
  });

  test('should preserve the hash', () => {
    const request = new Request('https://example.com/path?foo=bar#section');
    const result = getCleanUrl(request);
    expect(result).toBe('https://example.com/path#section');
  });

  test('should handle root path', () => {
    const request = new Request('https://example.com/?foo=bar');
    expect(getCleanUrl(request)).toBe('https://example.com/');
  });

  test('should handle multiple search params', () => {
    const request = new Request('https://example.com/page?a=1&a=2&a=3');
    expect(getCleanUrl(request)).toBe('https://example.com/page');
  });

  test('should handle URL with port', () => {
    const request = new Request('https://example.com:8080/path?foo=bar');
    expect(getCleanUrl(request)).toBe('https://example.com:8080/path');
  });

  test('should handle localhost', () => {
    const request = new Request('http://localhost:3000/api?debug=true');
    expect(getCleanUrl(request)).toBe('http://localhost:3000/api');
  });
});
