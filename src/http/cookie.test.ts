import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteCookie,
  deleteCookieSync,
  getCookie,
  getCookieSync,
  setCookie,
  setCookieSync,
} from './cookie';

describe('setCookie', () => {
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

    setCookie('test', 'value');

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

    setCookie('test', 'hello world');

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

    setCookie('test', 'value', { path: '/' });

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
    setCookie('test', 'value', { expires });

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

    setCookie('test', 'value', { sameSite: 'strict' });

    expect(cookieValue).toBe('test=value; SameSite=strict');
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

    setCookie('test', 'value', { secure: true });

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

    setCookie('test', 'value', { domain: '.example.com' });

    expect(cookieValue).toBe('test=value; domain=.example.com');
  });

  it('should warn when called on server side', async () => {
    vi.unstubAllGlobals();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await setCookie('test', 'value');

    expect(consoleSpy).toHaveBeenCalledWith('Cannot set cookie on server side');
    consoleSpy.mockRestore();
  });
});

describe('getCookie', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should get a cookie value', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'test=value' });

    expect(await getCookie('test')).toBe('value');
  });

  it('should return null for non-existent cookie', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'other=value' });

    expect(await getCookie('test')).toBeNull();
  });

  it('should decode URL-encoded values', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'test=hello%20world' });

    expect(await getCookie('test')).toBe('hello world');
  });

  it('should handle multiple cookies', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'first=1; test=value; last=3' });

    expect(await getCookie('test')).toBe('value');
  });

  it('should warn when called on server side', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await getCookie('test')).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Cannot get cookie on server side');

    consoleSpy.mockRestore();
  });

  it('should use Cookie Store API when available', async () => {
    const mockGet = vi.fn().mockResolvedValue({ value: 'store-value' });
    vi.stubGlobal('window', {
      cookieStore: {
        get: mockGet,
      },
    });

    const result = await getCookie('test');

    expect(result).toBe('store-value');
    expect(mockGet).toHaveBeenCalledWith('test');
  });

  it('should handle Cookie Store API returning null', async () => {
    const mockGet = vi.fn().mockResolvedValue(null);
    vi.stubGlobal('window', {
      cookieStore: {
        get: mockGet,
      },
    });

    const result = await getCookie('test');

    expect(result).toBeNull();
  });

  it('should handle Cookie Store API errors', async () => {
    const mockGet = vi.fn().mockRejectedValue(new Error('Store error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('window', {
      cookieStore: {
        get: mockGet,
      },
    });

    const result = await getCookie('test');

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get cookie 'test':", 'Store error');

    consoleErrorSpy.mockRestore();
  });

  it('should handle unknown errors', async () => {
    const mockGet = vi.fn().mockRejectedValue('unknown error');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('window', {
      cookieStore: {
        get: mockGet,
      },
    });

    const result = await getCookie('test');

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get cookie 'test': Unknown error");

    consoleErrorSpy.mockRestore();
  });
});

describe('setCookie with Cookie Store API', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should use Cookie Store API when available', async () => {
    const mockSet = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('window', {
      cookieStore: {
        set: mockSet,
      },
    });

    await setCookie('test', 'value', { path: '/', sameSite: 'lax' });

    expect(mockSet).toHaveBeenCalledWith({
      domain: undefined,
      name: 'test',
      path: '/',
      sameSite: 'lax',
      value: 'value',
    });
  });

  it('should include expires in Cookie Store API call', async () => {
    const mockSet = vi.fn().mockResolvedValue(undefined);
    const expires = new Date('2025-01-01');

    vi.stubGlobal('window', {
      cookieStore: {
        set: mockSet,
      },
    });

    await setCookie('test', 'value', { expires });

    expect(mockSet).toHaveBeenCalledWith({
      domain: undefined,
      expires: expires.getTime(),
      name: 'test',
      path: undefined,
      sameSite: undefined,
      value: 'value',
    });
  });

  it('should handle Cookie Store API errors', async () => {
    const mockSet = vi.fn().mockRejectedValue(new Error('Store error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('window', {
      cookieStore: {
        set: mockSet,
      },
    });

    await setCookie('test', 'value');

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to set cookie 'test':", 'Store error');

    consoleErrorSpy.mockRestore();
  });

  it('should handle unknown Cookie Store API errors', async () => {
    const mockSet = vi.fn().mockRejectedValue('unknown');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('window', {
      cookieStore: {
        set: mockSet,
      },
    });

    await setCookie('test', 'value');

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to set cookie 'test': Unknown error");

    consoleErrorSpy.mockRestore();
  });
});

describe('deleteCookie', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should delete cookie using Cookie Store API', async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('window', {
      cookieStore: {
        delete: mockDelete,
      },
    });

    await deleteCookie('test', { path: '/' });

    expect(mockDelete).toHaveBeenCalledWith({
      domain: undefined,
      name: 'test',
      path: '/',
    });
  });

  it('should delete cookie using document.cookie fallback', async () => {
    let cookieValue = '';
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    await deleteCookie('test', { path: '/' });

    expect(cookieValue).toContain('test=');
    expect(cookieValue).toContain('expires=Thu, 01 Jan 1970');
  });

  it('should warn when called on server side', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await deleteCookie('test');

    expect(consoleSpy).toHaveBeenCalledWith('Cannot delete cookie on server side');

    consoleSpy.mockRestore();
  });

  it('should handle Cookie Store API delete errors', async () => {
    const mockDelete = vi.fn().mockRejectedValue(new Error('Delete error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('window', {
      cookieStore: {
        delete: mockDelete,
      },
    });

    await deleteCookie('test');

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to delete cookie 'test':", 'Delete error');

    consoleErrorSpy.mockRestore();
  });

  it('should handle unknown delete errors', async () => {
    const mockDelete = vi.fn().mockRejectedValue('unknown');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('window', {
      cookieStore: {
        delete: mockDelete,
      },
    });

    await deleteCookie('test');

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to delete cookie 'test': Unknown error");

    consoleErrorSpy.mockRestore();
  });
});

describe('setCookieSync', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: '' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should set a simple cookie synchronously', () => {
    let cookieValue = '';
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    setCookieSync('test', 'value');

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

    setCookieSync('test', 'hello world');

    expect(cookieValue).toBe('test=hello%20world');
  });

  it('should set cookie with all options', () => {
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
    setCookieSync('test', 'value', {
      domain: '.example.com',
      expires,
      path: '/',
      sameSite: 'strict',
      secure: true,
    });

    expect(cookieValue).toContain('test=value');
    expect(cookieValue).toContain('expires=');
    expect(cookieValue).toContain('path=/');
    expect(cookieValue).toContain('SameSite=strict');
    expect(cookieValue).toContain('Secure');
    expect(cookieValue).toContain('domain=.example.com');
  });

  it('should warn when called on server side', () => {
    vi.unstubAllGlobals();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    setCookieSync('test', 'value');

    expect(consoleSpy).toHaveBeenCalledWith('Cannot set cookie on server side');
    consoleSpy.mockRestore();
  });

  it('should handle errors gracefully', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      get cookie() {
        throw new Error('Cookie error');
      },
      set cookie(_value: string) {
        throw new Error('Cookie error');
      },
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    setCookieSync('test', 'value');

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to set cookie 'test':", 'Cookie error');
    consoleErrorSpy.mockRestore();
  });
});

describe('getCookieSync', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should get a cookie value synchronously', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'test=value' });

    expect(getCookieSync('test')).toBe('value');
  });

  it('should return null for non-existent cookie', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'other=value' });

    expect(getCookieSync('test')).toBeNull();
  });

  it('should decode URL-encoded values', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'test=hello%20world' });

    expect(getCookieSync('test')).toBe('hello world');
  });

  it('should handle multiple cookies', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: 'first=1; test=value; last=3' });

    expect(getCookieSync('test')).toBe('value');
  });

  it('should warn when called on server side', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(getCookieSync('test')).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Cannot get cookie on server side');

    consoleSpy.mockRestore();
  });

  it('should handle errors gracefully', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      get cookie() {
        throw new Error('Cookie error');
      },
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(getCookieSync('test')).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get cookie 'test':", 'Cookie error');

    consoleErrorSpy.mockRestore();
  });
});

describe('deleteCookieSync', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should delete cookie synchronously', () => {
    let cookieValue = '';
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      get cookie() {
        return cookieValue;
      },
      set cookie(value: string) {
        cookieValue = value;
      },
    });

    deleteCookieSync('test', { path: '/' });

    expect(cookieValue).toContain('test=');
    expect(cookieValue).toContain('expires=Thu, 01 Jan 1970');
    expect(cookieValue).toContain('path=/');
  });

  it('should warn when called on server side', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    deleteCookieSync('test');

    expect(consoleSpy).toHaveBeenCalledWith('Cannot delete cookie on server side');

    consoleSpy.mockRestore();
  });

  it('should handle errors gracefully', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      get cookie() {
        throw new Error('Cookie error');
      },
      set cookie(_value: string) {
        throw new Error('Cookie error');
      },
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    deleteCookieSync('test');

    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to delete cookie 'test':", 'Cookie error');
    consoleErrorSpy.mockRestore();
  });
});
