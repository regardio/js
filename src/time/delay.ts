/** Delays using a promise
 * @param ms Milisecods of delay
 * @return Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
}
