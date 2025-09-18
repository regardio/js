/**
 * Helper function to set cookies in a more controlled way
 * @param name - The name of the cookie
 * @param value - The value to set
 * @param options - Cookie options
 */
export function setCookieValue(
  name: string,
  value: string,
  options: {
    expires?: Date;
    path?: string;
    sameSite?: string;
    secure?: boolean;
    domain?: string;
  } = {},
): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot set cookie on server side');
    return;
  }

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

  // Use try-catch to handle potential SecurityError in some contexts
  try {
    // biome-ignore lint/suspicious/noDocumentCookie: @TODO let's look into this later
    document.cookie = cookieString;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to set cookie '${name}':`, error.message);
    } else {
      console.error(`Failed to set cookie '${name}': Unknown error`);
    }
  }
}

/**
 * Get a cookie value by name
 * @param name - The name of the cookie to get
 * @returns The cookie value or null if not found
 */
export function getCookieValue(name: string): string | null {
  if (typeof window === 'undefined') {
    console.warn('Cannot get cookie on server side');
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }

  return null;
}
