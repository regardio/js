import { describe, expect, test } from 'vitest';
import { createDomain } from './domain';

describe('createDomain', () => {
  test('handles request behind proxy with x-forwarded-proto', () => {
    const request = new Request('http://example.com', {
      headers: {
        host: 'example.com',
        'x-forwarded-proto': 'https',
      },
    });
    expect(createDomain(request)).toBe('https://example.com');
  });

  test('handles localhost development environment', () => {
    const request = new Request('http://localhost:3000/path');
    expect(createDomain(request)).toBe('http://localhost:3000');
  });

  test('handles production environment', () => {
    const request = new Request('https://production.com/path');
    expect(createDomain(request)).toBe('https://production.com');
  });

  test('uses URL host when x-forwarded-proto exists but host header is missing', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-forwarded-proto': 'https',
      },
    });
    expect(createDomain(request)).toBe('https://example.com');
  });
});
