function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(items: T[]): T {
  return items[getRandomNumber(0, items.length - 1)];
}

function getRandomItems<T>(items: T[]):T[] {
  const startPosition = getRandomNumber(0, items.length - 1);
  const endPosition = Math.min(items.length, startPosition + getRandomNumber(1, items.length - startPosition));
  return items.slice(startPosition, endPosition);
}

export {getRandomNumber, getRandomItems, getRandomItem};
