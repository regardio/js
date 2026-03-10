import { describe, expect, it } from 'vitest';
import {
  deleteCookieFromResponse,
  getAllCookiesFromRequest,
  getCookieFromRequest,
  parseCookies,
  serializeCookie,
  setCookieOnResponse,
} from './cookie.server';

describe('parseCookies', () => {
  it('should parse a simple cookie string', () => {
    const result = parseCookies('session=abc123');
    expect(result).toEqual({ session: 'abc123' });
  });

  it('should parse multiple cookies', () => {
    const result = parseCookies('session=abc123; theme=dark; lang=en');
    expect(result).toEqual({
      lang: 'en',
      session: 'abc123',
      theme: 'dark',
    });
  });

  it('should handle URL-encoded values', () => {
    const result = parseCookies('message=hello%20world');
    expect(result).toEqual({ message: 'hello world' });
  });

  it('should return empty object for null input', () => {
    expect(parseCookies(null)).toEqual({});
  });

  it('should return empty object for undefined input', () => {
    expect(parseCookies(undefined)).toEqual({});
  });

  it('should return empty object for empty string', () => {
    expect(parseCookies('')).toEqual({});
  });
});

describe('serializeCookie', () => {
  it('should serialize a simple cookie', () => {
    const result = serializeCookie('session', 'abc123');
    expect(result).toBe('session=abc123');
  });

  it('should serialize with path', () => {
    const result = serializeCookie('session', 'abc123', { path: '/' });
    expect(result).toBe('session=abc123; Path=/');
  });

  it('should serialize with expires', () => {
    const expires = new Date('2025-01-01T00:00:00Z');
    const result = serializeCookie('session', 'abc123', { expires });
    expect(result).toContain('session=abc123');
    expect(result).toContain('Expires=');
  });

  it('should serialize with maxAge', () => {
    const result = serializeCookie('session', 'abc123', { maxAge: 3600 });
    expect(result).toBe('session=abc123; Max-Age=3600');
  });

  it('should serialize with sameSite', () => {
    const result = serializeCookie('session', 'abc123', { sameSite: 'lax' });
    expect(result).toBe('session=abc123; SameSite=Lax');
  });

  it('should serialize with secure flag', () => {
    const result = serializeCookie('session', 'abc123', { secure: true });
    expect(result).toBe('session=abc123; Secure');
  });

  it('should serialize with httpOnly flag', () => {
    const result = serializeCookie('session', 'abc123', { httpOnly: true });
    expect(result).toBe('session=abc123; HttpOnly');
  });

  it('should serialize with domain', () => {
    const result = serializeCookie('session', 'abc123', { domain: '.example.com' });
    expect(result).toBe('session=abc123; Domain=.example.com');
  });

  it('should serialize with multiple options', () => {
    const result = serializeCookie('session', 'abc123', {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
    expect(result).toContain('session=abc123');
    expect(result).toContain('Path=/');
    expect(result).toContain('Secure');
    expect(result).toContain('HttpOnly');
    expect(result).toContain('SameSite=Strict');
  });

  it('should URL-encode special characters', () => {
    const result = serializeCookie('message', 'hello world');
    expect(result).toBe('message=hello%20world');
  });
});

describe('getCookieFromRequest', () => {
  it('should get a cookie from request', () => {
    const request = new Request('https://example.com', {
      headers: { Cookie: 'session=abc123; theme=dark' },
    });

    expect(getCookieFromRequest(request, 'session')).toBe('abc123');
    expect(getCookieFromRequest(request, 'theme')).toBe('dark');
  });

  it('should return null for non-existent cookie', () => {
    const request = new Request('https://example.com', {
      headers: { Cookie: 'session=abc123' },
    });

    expect(getCookieFromRequest(request, 'theme')).toBeNull();
  });

  it('should return null when no Cookie header', () => {
    const request = new Request('https://example.com');

    expect(getCookieFromRequest(request, 'session')).toBeNull();
  });
});

describe('getAllCookiesFromRequest', () => {
  it('should get all cookies from request', () => {
    const request = new Request('https://example.com', {
      headers: { Cookie: 'session=abc123; theme=dark; lang=en' },
    });

    expect(getAllCookiesFromRequest(request)).toEqual({
      lang: 'en',
      session: 'abc123',
      theme: 'dark',
    });
  });

  it('should return empty object when no cookies', () => {
    const request = new Request('https://example.com');

    expect(getAllCookiesFromRequest(request)).toEqual({});
  });
});

describe('setCookieOnResponse', () => {
  it('should set a cookie on response', () => {
    const response = new Response('OK');
    const newResponse = setCookieOnResponse(response, 'session', 'abc123');

    expect(newResponse.headers.get('Set-Cookie')).toBe('session=abc123');
  });

  it('should set a cookie with options', () => {
    const response = new Response('OK');
    const newResponse = setCookieOnResponse(response, 'session', 'abc123', {
      httpOnly: true,
      path: '/',
      secure: true,
    });

    const setCookie = newResponse.headers.get('Set-Cookie');
    expect(setCookie).toContain('session=abc123');
    expect(setCookie).toContain('Path=/');
    expect(setCookie).toContain('Secure');
    expect(setCookie).toContain('HttpOnly');
  });

  it('should preserve existing headers', () => {
    const response = new Response('OK', {
      headers: { 'Content-Type': 'application/json' },
    });
    const newResponse = setCookieOnResponse(response, 'session', 'abc123');

    expect(newResponse.headers.get('Content-Type')).toBe('application/json');
    expect(newResponse.headers.get('Set-Cookie')).toBe('session=abc123');
  });

  it('should allow multiple Set-Cookie headers', () => {
    const response = new Response('OK');
    let newResponse = setCookieOnResponse(response, 'session', 'abc123');
    newResponse = setCookieOnResponse(newResponse, 'theme', 'dark');

    const setCookies = newResponse.headers.getSetCookie();
    expect(setCookies).toHaveLength(2);
    expect(setCookies[0]).toBe('session=abc123');
    expect(setCookies[1]).toBe('theme=dark');
  });

  it('should preserve response body and status', async () => {
    const response = new Response('Hello', { status: 201 });
    const newResponse = setCookieOnResponse(response, 'session', 'abc123');

    expect(newResponse.status).toBe(201);
    expect(await newResponse.text()).toBe('Hello');
  });
});

describe('deleteCookieFromResponse', () => {
  it('should delete a cookie from response', () => {
    const response = new Response('OK');
    const newResponse = deleteCookieFromResponse(response, 'session');

    const setCookie = newResponse.headers.get('Set-Cookie');
    expect(setCookie).toContain('session=');
    expect(setCookie).toContain('Expires=Thu, 01 Jan 1970');
    expect(setCookie).toContain('Max-Age=0');
  });

  it('should delete a cookie with path and domain', () => {
    const response = new Response('OK');
    const newResponse = deleteCookieFromResponse(response, 'session', {
      domain: '.example.com',
      path: '/',
    });

    const setCookie = newResponse.headers.get('Set-Cookie');
    expect(setCookie).toContain('session=');
    expect(setCookie).toContain('Path=/');
    expect(setCookie).toContain('Domain=.example.com');
    expect(setCookie).toContain('Expires=Thu, 01 Jan 1970');
  });
});
