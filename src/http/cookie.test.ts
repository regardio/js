import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCookieValue, setCookieValue } from './cookie';

describe('setCookieValue', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: '' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should set a simple cookie', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieValue('test', 'value');

    expect(cookieValue).toBe('test=value');
  });

  it('should encode special characters', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieValue('test', 'hello world');

    expect(cookieValue).toBe('test=hello%20world');
  });

  it('should set cookie with path', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieValue('test', 'value', { path: '/' });

    expect(cookieValue).toBe('test=value; path=/');
  });

  it('should set cookie with expires', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    const expires = new Date('2025-01-01T00:00:00Z');
    setCookieValue('test', 'value', { expires });

    expect(cookieValue).toContain('expires=');
  });

  it('should set cookie with sameSite', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieValue('test', 'value', { sameSite: 'Strict' });

    expect(cookieValue).toBe('test=value; SameSite=Strict');
  });

  it('should set secure cookie', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieValue('test', 'value', { secure: true });

    expect(cookieValue).toBe('test=value; Secure');
  });

  it('should set cookie with domain', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieValue('test', 'value', { domain: '.example.com' });

    expect(cookieValue).toBe('test=value; domain=.example.com');
  });

  it('should warn when called on server side', () => {
    vi.unstubAllGlobals();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    setCookieValue('test', 'value');

    expect(consoleSpy).toHaveBeenCalledWith('Cannot set cookie on server side');
    consoleSpy.mockRestore();
  });
});

describe('getCookieValue', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should get a cookie value', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'test=value' });

    expect(getCookieValue('test')).toBe('value');
  });

  it('should return null for non-existent cookie', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'other=value' });

    expect(getCookieValue('test')).toBeNull();
  });

  it('should decode URL-encoded values', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'test=hello%20world' });

    expect(getCookieValue('test')).toBe('hello world');
  });

  it('should handle multiple cookies', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'first=1; test=value; last=3' });

    expect(getCookieValue('test')).toBe('value');
  });

  it('should warn when called on server side', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(getCookieValue('test')).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Cannot get cookie on server side');

    consoleSpy.mockRestore();
  });
});
