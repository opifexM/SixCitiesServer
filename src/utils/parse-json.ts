function parseJson(jsonString: string): string {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Error parsing JSON: ${error}`);
  }
}

export {parseJson};
