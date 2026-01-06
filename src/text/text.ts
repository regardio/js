/**
 * Quote style configuration for a locale
 */
interface QuoteStyle {
  /** Opening primary quote (for double quotes) */
  open: string;
  /** Closing primary quote (for double quotes) */
  close: string;
  /** Opening secondary quote (for single quotes) */
  openSingle: string;
  /** Closing secondary quote (for single quotes) */
  closeSingle: string;
}

/**
 * Locale-specific typographic quote styles
 * Using Unicode escape sequences to avoid encoding issues
 * @see https://en.wikipedia.org/wiki/Quotation_mark#Summary_table
 */
const quoteStyles: Record<string, QuoteStyle> = {
  cs: { close: '\u201D', closeSingle: '\u2019', open: '\u201E', openSingle: '\u201A' },
  // Danish, Norwegian - » « › ‹
  da: { close: '\u00AB', closeSingle: '\u203A', open: '\u00BB', openSingle: '\u2039' },
  // German (Germany, Austria) - „ " ‚ '
  de: { close: '\u201D', closeSingle: '\u2019', open: '\u201E', openSingle: '\u201A' },
  // German (Switzerland) - « » ‹ ›
  'de-ch': { close: '\u00BB', closeSingle: '\u203A', open: '\u00AB', openSingle: '\u2039' },
  // English (US, UK, etc.) - " " ' '
  en: { close: '\u201D', closeSingle: '\u2019', open: '\u201C', openSingle: '\u2018' },
  // Spanish, Italian, Portuguese - « » " "
  es: { close: '\u00BB', closeSingle: '\u201D', open: '\u00AB', openSingle: '\u201C' },
  fi: { close: '\u201D', closeSingle: '\u2019', open: '\u201D', openSingle: '\u2019' },
  // French - « » ‹ › (with spaces)
  fr: { close: ' \u00BB', closeSingle: ' \u203A', open: '\u00AB ', openSingle: '\u2039 ' },
  hu: { close: '\u201D', closeSingle: '\u2019', open: '\u201E', openSingle: '\u201A' },
  it: { close: '\u00BB', closeSingle: '\u201D', open: '\u00AB', openSingle: '\u201C' },
  // Japanese - 「 」 『 』
  ja: { close: '\u300D', closeSingle: '\u300F', open: '\u300C', openSingle: '\u300E' },
  // Dutch - ' ' ' '
  nl: { close: '\u2019', closeSingle: '\u2019', open: '\u2018', openSingle: '\u2018' },
  no: { close: '\u00AB', closeSingle: '\u203A', open: '\u00BB', openSingle: '\u2039' },
  // Polish, Czech, Hungarian - „ " ‚ '
  pl: { close: '\u201D', closeSingle: '\u2019', open: '\u201E', openSingle: '\u201A' },
  pt: { close: '\u00BB', closeSingle: '\u201D', open: '\u00AB', openSingle: '\u201C' },
  // Russian - « » ‚ '
  ru: { close: '\u00BB', closeSingle: '\u2019', open: '\u00AB', openSingle: '\u201A' },
  // Swedish, Finnish - " " ' '
  sv: { close: '\u201D', closeSingle: '\u2019', open: '\u201D', openSingle: '\u2019' },
  // Chinese - 「 」 『 』
  zh: { close: '\u300D', closeSingle: '\u300F', open: '\u300C', openSingle: '\u300E' },
};

/**
 * Get the quote style for a given locale.
 * Falls back to base language if region-specific style not found,
 * then to English style as default.
 */
function getQuoteStyle(locale: string): QuoteStyle {
  const normalized = locale.toLowerCase();

  // Try exact match first
  const exactMatch = quoteStyles[normalized];
  if (exactMatch) {
    return exactMatch;
  }

  // Try base language (e.g., 'de' from 'de-DE')
  const baseLanguage = normalized.split('-')[0];
  if (baseLanguage) {
    const baseMatch = quoteStyles[baseLanguage];
    if (baseMatch) {
      return baseMatch;
    }
  }

  // Default to English - we know 'en' exists
  return quoteStyles.en as QuoteStyle;
}

/**
 * Replace straight quotes with typographically correct quotes for the given locale.
 *
 * @param text - The text containing straight quotes
 * @param locale - The locale to use for quote style (e.g., 'en', 'de', 'fr')
 * @returns Text with typographic quotes
 *
 * @example
 * typographicQuotes('"Hello"', 'en') // → '"Hello"'
 * typographicQuotes('"Hello"', 'de') // → '„Hello"'
 * typographicQuotes('"Hello"', 'fr') // → '« Hello »'
 */
export function typographicQuotes(text: string, locale: string): string {
  const style = getQuoteStyle(locale);

  // Replace double quotes
  let result = text.replace(/"([^"]*)"/g, `${style.open}$1${style.close}`);

  // Replace single quotes (apostrophes that are actually quotes)
  // Only replace pairs, not contractions like "don't"
  result = result.replace(/'([^']*)'/g, `${style.openSingle}$1${style.closeSingle}`);

  return result;
}

export function toBoolean(value: string | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true' || value === '1';
}

/**
 * Replace &shy; HTML entity with Unicode soft hyphen
 */
export function replaceShyInString(input: string): string {
  return input.replace(/&shy;/g, '\u00AD');
}

/**
 * Split text into sentences
 */
export function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/);
}

/**
 * Split text into words
 */
export function splitIntoWords(text: string): string[] {
  return text.split(/\s+/);
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Author info parsed from a string like "Name <email> (url)"
 */
export type AuthorInfo = {
  name?: string;
  email?: string;
  url?: string;
};

const authorRegex = /^(.*?)\s*(?:<([^>]+)>)?\s*(?:\(([^)]+)\))?$/;

/**
 * Parse an author string in the format "Name <email> (url)"
 */
export function parseAuthorString(input: string): AuthorInfo {
  const match = input.match(authorRegex);

  if (match) {
    const [, name, email, url] = match;

    const result: AuthorInfo = {};

    if (email) {
      result.email = email;
    }

    const trimmedName = name?.trim();

    if (trimmedName) {
      result.name = trimmedName;
    }

    if (url) {
      result.url = url;
    }

    return result;
  }

  return {};
}
