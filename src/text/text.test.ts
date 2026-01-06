import { describe, expect, it } from 'vitest';
import {
  parseAuthorString,
  replaceShyInString,
  splitIntoSentences,
  splitIntoWords,
  toBoolean,
  truncateText,
  typographicQuotes,
} from './text';

describe('typographicQuotes', () => {
  it('should replace double quotes with English curly quotes', () => {
    expect(typographicQuotes('"Hello"', 'en')).toBe('\u201CHello\u201D');
  });

  it('should replace double quotes with German quotes', () => {
    expect(typographicQuotes('"Hello"', 'de')).toBe('\u201EHello\u201D');
  });

  it('should replace double quotes with French quotes', () => {
    expect(typographicQuotes('"Hello"', 'fr')).toBe('\u00AB Hello \u00BB');
  });

  it('should replace single quotes', () => {
    expect(typographicQuotes("'Hello'", 'en')).toBe('\u2018Hello\u2019');
  });

  it('should handle multiple quotes', () => {
    expect(typographicQuotes('"Hello" and "World"', 'en')).toBe(
      '\u201CHello\u201D and \u201CWorld\u201D',
    );
  });

  it('should fall back to English for unknown locales', () => {
    expect(typographicQuotes('"Hello"', 'xx')).toBe('\u201CHello\u201D');
  });

  it('should handle locale with region code', () => {
    expect(typographicQuotes('"Hello"', 'de-DE')).toBe('\u201EHello\u201D');
  });

  it('should use Swiss German quotes for de-ch', () => {
    expect(typographicQuotes('"Hello"', 'de-ch')).toBe('\u00ABHello\u00BB');
  });
});

describe('toBoolean', () => {
  it('should return true for boolean true', () => {
    expect(toBoolean(true)).toBe(true);
  });

  it('should return false for boolean false', () => {
    expect(toBoolean(false)).toBe(false);
  });

  it('should return true for string "true"', () => {
    expect(toBoolean('true')).toBe(true);
  });

  it('should return true for string "1"', () => {
    expect(toBoolean('1')).toBe(true);
  });

  it('should return false for string "false"', () => {
    expect(toBoolean('false')).toBe(false);
  });

  it('should return false for null', () => {
    expect(toBoolean(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(toBoolean(undefined)).toBe(false);
  });

  it('should return false for other strings', () => {
    expect(toBoolean('yes')).toBe(false);
  });
});

describe('replaceShyInString', () => {
  it('should replace &shy; with soft hyphen', () => {
    expect(replaceShyInString('hel&shy;lo')).toBe('hel\u00ADlo');
  });

  it('should replace multiple &shy;', () => {
    expect(replaceShyInString('a&shy;b&shy;c')).toBe('a\u00ADb\u00ADc');
  });

  it('should return unchanged string without &shy;', () => {
    expect(replaceShyInString('hello')).toBe('hello');
  });
});

describe('splitIntoSentences', () => {
  it('should split text by periods', () => {
    expect(splitIntoSentences('Hello. World.')).toEqual(['Hello.', 'World.']);
  });

  it('should split text by exclamation marks', () => {
    expect(splitIntoSentences('Hello! World!')).toEqual(['Hello!', 'World!']);
  });

  it('should split text by question marks', () => {
    expect(splitIntoSentences('Hello? World?')).toEqual(['Hello?', 'World?']);
  });

  it('should handle mixed punctuation', () => {
    expect(splitIntoSentences('Hello. World! How?')).toEqual(['Hello.', 'World!', 'How?']);
  });

  it('should return single sentence without splitting', () => {
    expect(splitIntoSentences('Hello world')).toEqual(['Hello world']);
  });
});

describe('splitIntoWords', () => {
  it('should split text by spaces', () => {
    expect(splitIntoWords('hello world')).toEqual(['hello', 'world']);
  });

  it('should handle multiple spaces', () => {
    expect(splitIntoWords('hello  world')).toEqual(['hello', 'world']);
  });

  it('should handle tabs', () => {
    expect(splitIntoWords('hello\tworld')).toEqual(['hello', 'world']);
  });

  it('should handle newlines', () => {
    expect(splitIntoWords('hello\nworld')).toEqual(['hello', 'world']);
  });
});

describe('truncateText', () => {
  it('should not truncate short text', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('should truncate long text with default suffix', () => {
    expect(truncateText('hello world', 8)).toBe('hello...');
  });

  it('should truncate with custom suffix', () => {
    expect(truncateText('hello world', 8, '…')).toBe('hello w…');
  });

  it('should handle exact length', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });
});

describe('parseAuthorString', () => {
  it('should parse name only', () => {
    expect(parseAuthorString('John Doe')).toEqual({ name: 'John Doe' });
  });

  it('should parse name and email', () => {
    expect(parseAuthorString('John Doe <john@example.com>')).toEqual({
      email: 'john@example.com',
      name: 'John Doe',
    });
  });

  it('should parse name and url', () => {
    expect(parseAuthorString('John Doe (https://example.com)')).toEqual({
      name: 'John Doe',
      url: 'https://example.com',
    });
  });

  it('should parse name, email, and url', () => {
    expect(parseAuthorString('John Doe <john@example.com> (https://example.com)')).toEqual({
      email: 'john@example.com',
      name: 'John Doe',
      url: 'https://example.com',
    });
  });

  it('should return empty object for empty string', () => {
    expect(parseAuthorString('')).toEqual({});
  });

  it('should handle whitespace in name', () => {
    expect(parseAuthorString('  John Doe  ')).toEqual({ name: 'John Doe' });
  });
});
