import {MockServerData} from '#src/type/mock-server-data.type.js';

export interface OfferGenerator {
  generate(mockData: MockServerData): string;
}
