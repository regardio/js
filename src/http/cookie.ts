export interface CookieOptions {
  domain?: string;
  expires?: Date;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

function hasCookieStore(): boolean {
  return typeof window !== 'undefined' && 'cookieStore' in window;
}

function buildCookieString(name: string, value: string, options: CookieOptions): string {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }

  if (options.secure) {
    cookieString += '; Secure';
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  return cookieString;
}

function setViaCookieStore(name: string, value: string, options: CookieOptions): Promise<void> {
  const cookieInit: CookieInit = {
    domain: options.domain,
    name,
    path: options.path,
    sameSite: options.sameSite,
    value,
  };

  if (options.expires) {
    cookieInit.expires = options.expires.getTime();
  }

  return window.cookieStore.set(cookieInit);
}

function setViaDocumentCookie(name: string, value: string, options: CookieOptions): void {
  const cookieString = buildCookieString(name, value, options);

  // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without Cookie Store API
  document.cookie = cookieString;
}

async function getViaCookieStore(name: string): Promise<string | null> {
  const cookie = await window.cookieStore.get(name);
  return cookie?.value ?? null;
}

function getViaDocumentCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }

  return null;
}

/**
 * Set a cookie using Cookie Store API with document.cookie fallback
 * @param name - The name of the cookie
 * @param value - The value to set
 * @param options - Cookie options
 */
export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): Promise<void> {
  if (typeof window === 'undefined') {
    console.warn('Cannot set cookie on server side');
    return;
  }

  try {
    if (hasCookieStore()) {
      await setViaCookieStore(name, value, options);
    } else {
      setViaDocumentCookie(name, value, options);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to set cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to set cookie '${name}': Unknown error`);
    }
  }
}

/**
 * Get a cookie by name using Cookie Store API with document.cookie fallback
 * @param name - The name of the cookie to get
 * @returns The cookie value or null if not found
 */
export async function getCookie(name: string): Promise<string | null> {
  if (typeof window === 'undefined') {
    console.warn('Cannot get cookie on server side');
    return null;
  }

  try {
    if (hasCookieStore()) {
      return await getViaCookieStore(name);
    }
    return getViaDocumentCookie(name);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to get cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to get cookie '${name}': Unknown error`);
    }
    return null;
  }
}

/**
 * Delete a cookie by name using Cookie Store API with document.cookie fallback
 * @param name - The name of the cookie to delete
 * @param options - Cookie options (path and domain should match the original cookie)
 */
export async function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {},
): Promise<void> {
  if (typeof window === 'undefined') {
    console.warn('Cannot delete cookie on server side');
    return;
  }

  try {
    if (hasCookieStore()) {
      await window.cookieStore.delete({
        domain: options.domain,
        name,
        path: options.path,
      });
    } else {
      const expires = new Date(0);
      setViaDocumentCookie(name, '', { ...options, expires });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to delete cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to delete cookie '${name}': Unknown error`);
    }
  }
}

/**
 * Set a cookie synchronously using document.cookie (client-side only)
 * @param name - The name of the cookie
 * @param value - The value to set
 * @param options - Cookie options
 * @returns void
 * @note This function is synchronous and only works in browser environments
 */
export function setCookieSync(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot set cookie on server side');
    return;
  }

  try {
    setViaDocumentCookie(name, value, options);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to set cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to set cookie '${name}': Unknown error`);
    }
  }
}

/**
 * Get a cookie by name synchronously using document.cookie (client-side only)
 * @param name - The name of the cookie to get
 * @returns The cookie value or null if not found
 * @note This function is synchronous and only works in browser environments
 */
export function getCookieSync(name: string): string | null {
  if (typeof window === 'undefined') {
    console.warn('Cannot get cookie on server side');
    return null;
  }

  try {
    return getViaDocumentCookie(name);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to get cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to get cookie '${name}': Unknown error`);
    }
    return null;
  }
}

/**
 * Delete a cookie by name synchronously using document.cookie (client-side only)
 * @param name - The name of the cookie to delete
 * @param options - Cookie options (path and domain should match the original cookie)
 * @note This function is synchronous and only works in browser environments
 */
export function deleteCookieSync(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {},
): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot delete cookie on server side');
    return;
  }

  try {
    const expires = new Date(0);
    setViaDocumentCookie(name, '', { ...options, expires });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to delete cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to delete cookie '${name}': Unknown error`);
    }
  }
}
