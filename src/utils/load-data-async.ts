import got from 'got';

async function loadDataAsync<T>(url: string): Promise<T> {
  try {
    return await got.get(url).json<T>();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Can't load JSON data from ${url}: ${error.message}`);
      throw error;
    } else {
      throw new Error(`An unknown error occurred while load JSON data from ${url}:.`);
    }
  }
}

export {loadDataAsync};
