import type { Session, SessionData } from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import { LanguageDetector, LanguageDetectorLingui } from './language-detector';

describe('LanguageDetector', () => {
  const defaultOptions = {
    fallbackLanguage: 'en',
    supportedLanguages: ['en', 'de'],
  };

  describe('detect', () => {
    test('should detect language from search params', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com?lng=de');

      const language = await detector.detect(request);
      expect(language).toBe('de');
    });

    test('should detect language from cookie', async () => {
      const mockCookie = {
        isSigned: false,
        name: 'lng',
        parse: vi.fn(() => Promise.resolve('de')),
        secrets: ['secret'],
        serialize: vi.fn(() => Promise.resolve('serialized-cookie')),
      };

      const detector = new LanguageDetector({
        ...defaultOptions,
        cookie: mockCookie,
      });

      const request = new Request('https://example.com', {
        headers: {
          cookie: 'lng=de',
        },
      });

      const language = await detector.detect(request);
      expect(language).toBe('de');
    });

    test('should detect language from session', async () => {
      const mockSession = {
        commitSession: vi.fn(() => Promise.resolve('')),
        destroySession: vi.fn(() => Promise.resolve('')),
        getSession: vi.fn(() =>
          Promise.resolve({
            data: { lng: 'de' },
            flash: vi.fn(() => {}),
            // biome-ignore lint/suspicious/noExplicitAny: This is acceptable in tests
            get: <Key extends string>(key: Key): any => (key === 'lng' ? 'de' : undefined),
            has: (key: string): key is 'lng' => key === 'lng',
            id: '123',
            set: vi.fn(() => {}),
            unset: vi.fn(() => {}),
          } satisfies Session<SessionData>),
        ),
      };

      const detector = new LanguageDetector({
        ...defaultOptions,
        sessionStorage: mockSession,
      });

      const request = new Request('https://example.com');
      const language = await detector.detect(request);
      expect(language).toBe('de');
    });

    test('should detect language from Accept-Language header', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com', {
        headers: {
          'accept-language': 'de,en;q=0.9,en;q=0.8',
        },
      });

      const language = await detector.detect(request);
      expect(language).toBe('de');
    });

    test('should fall back to default language when no supported language is found', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com', {
        headers: {
          'accept-language': 'fr-FR,es-ES;q=0.9',
        },
      });

      const language = await detector.detect(request);
      expect(language).toBe('en');
    });

    test('should handle cookie parsing error', async () => {
      const mockCookie = {
        isSigned: false,
        name: 'lng',
        parse: vi.fn(() => Promise.reject(new Error('Cookie parsing failed'))),
        secrets: ['secret'],
        serialize: vi.fn(() => Promise.resolve('serialized-cookie')),
      };

      const detector = new LanguageDetector({
        ...defaultOptions,
        cookie: mockCookie,
      });

      const request = new Request('https://example.com', {
        headers: {
          cookie: 'lng=de',
        },
      });

      const language = await detector.detect(request);
      // Should fall back to next detection method
      expect(language).toBe('en');
    });

    test('should handle multiple language preferences in session', async () => {
      const mockSession = {
        commitSession: vi.fn(() => Promise.resolve('')),
        destroySession: vi.fn(() => Promise.resolve('')),
        getSession: vi.fn(() =>
          Promise.resolve({
            data: { lng: ['de', 'en'] },
            flash: vi.fn(() => {}),
            // biome-ignore lint/suspicious/noExplicitAny: This is acceptable in tests
            get: <Key extends string>(key: Key): any => (key === 'lng' ? ['de', 'en'] : undefined),
            has: (key: string): key is 'lng' => key === 'lng',
            id: '123',
            set: vi.fn(() => {}),
            unset: vi.fn(() => {}),
          } satisfies Session<SessionData>),
        ),
      };

      const detector = new LanguageDetector({
        ...defaultOptions,
        sessionStorage: mockSession,
      });

      const request = new Request('https://example.com');
      const language = await detector.detect(request);
      // Should use the first language in the array that is supported
      expect(language).toBe('de');
    });

    test('should handle invalid language code in search params', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com?lng=invalid-code');

      const language = await detector.detect(request);
      // Should fall back to default language
      expect(language).toBe('en');
    });
  });

  describe('language detection from header', () => {
    test('should return first supported language from Accept-Language header', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com', {
        headers: {
          'accept-language': 'fr-FR,de;q=0.9,en;q=0.8',
        },
      });

      const language = await detector.detect(request);
      expect(language).toBe('de');
    });

    test('should return fallback language when no supported language in header', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com', {
        headers: {
          'accept-language': 'fr-FR,es-ES;q=0.9',
        },
      });

      const language = await detector.detect(request);
      expect(language).toBe(defaultOptions.fallbackLanguage);
    });
  });

  describe('language detection from search params', () => {
    test('should return language from URL search params', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com?lng=de');

      const language = await detector.detect(request);
      expect(language).toBe('de');
    });

    test('should return fallback language when no language param exists', async () => {
      const detector = new LanguageDetector(defaultOptions);
      const request = new Request('https://example.com');

      const language = await detector.detect(request);
      expect(language).toBe(defaultOptions.fallbackLanguage);
    });
  });
});

describe('LanguageDetectorLingui', () => {
  const defaultOptions = {
    detection: {
      fallbackLanguage: 'en',
      supportedLanguages: ['en', 'de'],
    },
  };

  test('should detect language using underlying LanguageDetector', async () => {
    const detector = new LanguageDetectorLingui(defaultOptions);
    const request = new Request('https://example.com?lng=de');

    const language = await detector.getLocale(request);
    expect(language).toBe('de');
  });

  test('should fall back to default language when no supported language found', async () => {
    const detector = new LanguageDetectorLingui(defaultOptions);
    const request = new Request('https://example.com', {
      headers: {
        'accept-language': 'fr-FR,es-ES;q=0.9',
      },
    });

    const language = await detector.getLocale(request);
    expect(language).toBe('en');
  });
});
