import { describe, expect, test } from 'vitest';
import { getClientLocales } from './locale';

describe('getClientLocales', () => {
  describe('with Request object', () => {
    test('should return undefined when Accept-Language header is missing', () => {
      const request = new Request('https://example.com');
      expect(getClientLocales(request)).toBeUndefined();
    });

    test('should return single locale when only one is provided', () => {
      const request = new Request('https://example.com', {
        headers: { 'Accept-Language': 'en-US' },
      });
      expect(getClientLocales(request)).toBe('en-US');
    });

    test('should return array of locales sorted by quality', () => {
      const request = new Request('https://example.com', {
        headers: { 'Accept-Language': 'en-US,de;q=0.9,fr;q=0.8' },
      });
      const result = getClientLocales(request);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('en-US');
      expect(result).toContain('de');
    });

    test('should return undefined for invalid locales', () => {
      const request = new Request('https://example.com', {
        headers: { 'Accept-Language': 'invalid-locale-xyz' },
      });
      expect(getClientLocales(request)).toBeUndefined();
    });

    test('should ignore wildcard (*)', () => {
      const request = new Request('https://example.com', {
        headers: { 'Accept-Language': '*' },
      });
      expect(getClientLocales(request)).toBeUndefined();
    });
  });

  describe('with Headers object', () => {
    test('should return undefined when Accept-Language header is missing', () => {
      const headers = new Headers();
      expect(getClientLocales(headers)).toBeUndefined();
    });

    test('should return single locale when only one is provided', () => {
      const headers = new Headers({ 'Accept-Language': 'de-DE' });
      expect(getClientLocales(headers)).toBe('de-DE');
    });

    test('should return array of locales sorted by quality', () => {
      const headers = new Headers({ 'Accept-Language': 'fr-FR,en;q=0.9,de;q=0.8' });
      const result = getClientLocales(headers);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('fr-FR');
    });
  });

  describe('quality value handling', () => {
    test('should prioritize higher quality values', () => {
      const request = new Request('https://example.com', {
        headers: { 'Accept-Language': 'de;q=0.5,en;q=0.9' },
      });
      const result = getClientLocales(request);
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result[0]).toBe('en');
      }
    });

    test('should handle locales without explicit quality (default q=1)', () => {
      const request = new Request('https://example.com', {
        headers: { 'Accept-Language': 'en,de;q=0.9' },
      });
      const result = getClientLocales(request);
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result[0]).toBe('en');
      }
    });
  });
});
