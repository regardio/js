/**
 * Converts a base64 string to a Uint8Array
 * @param base64String The base64 string to convert
 * @returns A Uint8Array containing the decoded data
 */
export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

/**
 * Generate a cryptographically secure random base64 string.
 * @returns A base64-encoded random string (16 bytes of entropy)
 */
export function generateRandomBase64(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
