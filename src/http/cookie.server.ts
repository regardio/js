import { parse, serialize } from 'cookie-es';

export interface CookieSerializeOptions {
  domain?: string;
  encode?: (value: string) => string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none' | boolean;
  secure?: boolean;
}

/**
 * Parse cookies from a Cookie header string
 * @param cookieHeader - The Cookie header value (e.g., "session=abc123; theme=dark")
 * @returns Object with cookie name-value pairs
 */
export function parseCookies(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  try {
    return parse(cookieHeader);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to parse cookies:', error.message);
    }
    return {};
  }
}

/**
 * Serialize a cookie into a Set-Cookie header value
 * @param name - The cookie name
 * @param value - The cookie value
 * @param options - Cookie options
 * @returns Set-Cookie header value
 */
export function serializeCookie(
  name: string,
  value: string,
  options: CookieSerializeOptions = {},
): string {
  try {
    return serialize(name, value, options);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to serialize cookie '${name}':`, error.message);
    }
    throw error;
  }
}

/**
 * Get a cookie value from a Request object
 * @param request - The Request object
 * @param name - The cookie name to retrieve
 * @returns The cookie value or null if not found
 */
export function getCookieFromRequest(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies[name] ?? null;
}

/**
 * Set a cookie on a Response object by adding a Set-Cookie header
 * @param response - The Response object to modify
 * @param name - The cookie name
 * @param value - The cookie value
 * @param options - Cookie options
 * @returns A new Response with the Set-Cookie header added
 */
export function setCookieOnResponse(
  response: Response,
  name: string,
  value: string,
  options: CookieSerializeOptions = {},
): Response {
  const setCookieValue = serializeCookie(name, value, options);

  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', setCookieValue);

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

/**
 * Delete a cookie on a Response object by setting it with an expired date
 * @param response - The Response object to modify
 * @param name - The cookie name to delete
 * @param options - Cookie options (path and domain should match the original cookie)
 * @returns A new Response with the Set-Cookie header to delete the cookie
 */
export function deleteCookieFromResponse(
  response: Response,
  name: string,
  options: Pick<CookieSerializeOptions, 'path' | 'domain'> = {},
): Response {
  return setCookieOnResponse(response, name, '', {
    ...options,
    expires: new Date(0),
    maxAge: 0,
  });
}

/**
 * Get all cookies from a Request object
 * @param request - The Request object
 * @returns Object with all cookie name-value pairs
 */
export function getAllCookiesFromRequest(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie');
  return parseCookies(cookieHeader);
}
