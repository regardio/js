export async function measure<Result>(key: string, callback: () => Result | Promise<Result>) {
  const start = Date.now();

  try {
    let result = callback();
    if (result instanceof Promise) {
      result = await result;
    }

    return result;
  } finally {
    const end = Date.now();
    console.log(`${key} took ${end - start}ms`);
  }
}
