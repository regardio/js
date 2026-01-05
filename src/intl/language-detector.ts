import { parseAcceptLanguage } from 'intl-parse-accept-language';
import type { Cookie, SessionStorage } from 'react-router';

export interface LanguageDetectorOption {
  /**
   * Define the list of supported languages, this is used to determine if one of
   * the languages requested by the user is supported by the application.
   * This should be be same as the supportedLngs in the i18next options.
   */
  supportedLanguages: string[];
  /**
   * Define the fallback language that it's going to be used in the case user
   * expected language is not supported.
   * This should be be same as the fallbackLng in the i18next options.
   */
  fallbackLanguage: string;
  /**
   * If you want to use a cookie to store the user preferred language, you can
   * pass the Cookie object here.
   */
  cookie?: Cookie;
  /**
   * If you want to use a session to store the user preferred language, you can
   * pass the SessionStorage object here.
   * When this is not defined, getting the locale will ignore the session.
   */
  sessionStorage?: SessionStorage;
  /**
   * If defined a sessionStorage and want to change the default key used to
   * store the user preferred language, you can pass the key here.
   * @default "lng"
   */
  sessionKey?: string;
  /**
   * If you want to use search parameters for language detection and want to
   * change the default key used to for the parameter name,
   * you can pass the key here.
   * @default "lng"
   */
  searchParamKey?: string;
  /**
   * The order the library will use to detect the user preferred language.
   * By default the order is
   * - urlPath (first segment like /de/ or /en/)
   * - cookie
   * - session
   * - searchParams
   * - header
   * And finally the fallback language.
   */
  order?: Array<'urlPath' | 'searchParams' | 'cookie' | 'session' | 'header'>;
}

export interface LanguageDetectorLinguiOptions {
  detection: LanguageDetectorOption;
}

export class LanguageDetectorLingui {
  private detector: LanguageDetector;
  private options: LanguageDetectorLinguiOptions;

  constructor(options: LanguageDetectorLinguiOptions) {
    this.options = options;
    this.detector = new LanguageDetector(this.options.detection);
  }

  /**
   * Detect the current locale by following the order defined in the
   * `detection.order` option.
   * By default the order is
   * - urlPath (first segment like /de/ or /en/)
   * - cookie
   * - session
   * - searchParams
   * - header
   * And finally the fallback language.
   */
  public async getLocale(request: Request): Promise<string> {
    return await this.detector.detect(request);
  }
}

/**
 * The LanguageDetector contains the logic to detect the user preferred language
 * fully server-side by using a SessionStorage, Cookie, URLSearchParams, or
 * Headers.
 */
export class LanguageDetector {
  private options: LanguageDetectorOption;

  constructor(options: LanguageDetectorOption) {
    this.options = options;
    this.isSessionOnly(this.options);
    this.isCookieOnly(this.options);
  }

  public async detect(request: Request): Promise<string> {
    const order = this.options.order ?? ['urlPath', 'cookie', 'session', 'searchParams', 'header'];

    for (const method of order) {
      let locale: string | null = null;

      if (method === 'urlPath') {
        locale = this.fromUrlPath(request);
      }

      if (method === 'searchParams') {
        locale = this.fromSearchParams(request);
      }

      if (method === 'cookie') {
        locale = await this.fromCookie(request);
      }

      if (method === 'session') {
        locale = await this.fromSessionStorage(request);
      }

      if (method === 'header') {
        locale = this.fromHeader(request);
      }

      if (locale) return locale;
    }

    return this.options.fallbackLanguage;
  }

  private isSessionOnly(options: LanguageDetectorOption) {
    if (options.order?.length === 1 && options.order[0] === 'session' && !options.sessionStorage) {
      throw new Error(
        'You need a sessionStorage if you want to only get the locale from the session',
      );
    }
  }

  private isCookieOnly(options: LanguageDetectorOption) {
    if (options.order?.length === 1 && options.order[0] === 'cookie' && !options.cookie) {
      throw new Error('You need a cookie if you want to only get the locale from the cookie');
    }
  }

  private fromUrlPath(request: Request): string | null {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);

    // Check if the first path segment is a supported language
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      if (firstSegment) {
        return this.fromSupported(firstSegment);
      }
    }

    return null;
  }

  private fromSearchParams(request: Request): string | null {
    const url = new URL(request.url);
    if (!url.searchParams.has(this.options.searchParamKey ?? 'lng')) {
      return null;
    }
    return this.fromSupported(url.searchParams.get(this.options.searchParamKey ?? 'lng'));
  }

  private async fromCookie(request: Request): Promise<string | null> {
    if (!this.options.cookie) return null;

    const cookie = this.options.cookie;
    try {
      const lng = await cookie.parse(request.headers.get('Cookie'));
      if (typeof lng !== 'string' || !lng) return null;
      return this.fromSupported(lng);
    } catch (_error) {
      // If cookie parsing fails, return null to fall back to next method
      return null;
    }
  }

  private async fromSessionStorage(request: Request): Promise<string | null> {
    if (!this.options.sessionStorage) return null;

    const session = await this.options.sessionStorage.getSession(request.headers.get('Cookie'));

    const lng = session.get(this.options.sessionKey ?? 'lng');

    if (!lng) return null;

    return this.fromSupported(lng);
  }

  private fromHeader(request: Request): string | null {
    const locales = getClientLocales(request);

    if (!locales) return null;

    if (Array.isArray(locales)) return this.fromSupported(locales.join(','));

    return this.fromSupported(locales);
  }

  private fromSupported(language: string | string[] | null) {
    if (!language) return this.options.fallbackLanguage;

    const languageStr = Array.isArray(language) ? language.join(',') : language;

    const parsed = parseAcceptLanguage(languageStr, {
      ignoreWildcard: true,
      validate: (locale) => (this.options.supportedLanguages.includes(locale) ? locale : null),
    });

    return parsed[0] || this.options.fallbackLanguage;
  }
}

type Locales = string | string[] | undefined;

/**
 * Get the client's locales from the Accept-Language header.
 * If the header is not defined returns undefined.
 * If the header is defined return an array of locales, sorted by the quality
 * value.
 */
function getClientLocales(headers: Headers): Locales;
function getClientLocales(request: Request): Locales;
function getClientLocales(requestOrHeaders: Request | Headers): Locales {
  const headers = getHeaders(requestOrHeaders);

  const acceptLanguage = headers.get('Accept-Language');

  if (!acceptLanguage) return undefined;

  const locales = parseAcceptLanguage(acceptLanguage, {
    ignoreWildcard: true,
    validate: Intl.DateTimeFormat.supportedLocalesOf,
  });

  if (locales.length === 0) return undefined;
  if (locales.length === 1) return locales[0];
  return locales;
}

function getHeaders(requestOrHeaders: Request | Headers): Headers {
  if (requestOrHeaders instanceof Request) {
    return requestOrHeaders.headers;
  }

  return requestOrHeaders;
}
