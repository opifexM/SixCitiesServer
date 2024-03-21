import {GENERATOR_CONFIG} from '#src/offers/generator/generator-config.js';
import {OfferGenerator} from '#src/offers/generator/offer-generator.interface.js';
import {MockServerData} from '#src/type/mock-server-data.type.js';
import {getRandomItem, getRandomItems, getRandomNumber} from '#src/utils/random.js';
import dayjs from 'dayjs';
import {injectable} from 'inversify';
import {randomBytes} from 'node:crypto';

@injectable()
export class TsvOfferGenerator implements OfferGenerator {
  public generate(mockData: MockServerData): string {
    const title = `${getRandomItem(mockData.titles)} (${randomBytes(10).toString('hex')})`;
    const description = getRandomItem(mockData.descriptions);
    const publishDate = dayjs()
      .subtract(getRandomNumber(GENERATOR_CONFIG.FIRST_WEEK_DAY, GENERATOR_CONFIG.LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(mockData.cities);
    const previewImage = getRandomItem(mockData.previewImages);
    const images = getRandomItems(mockData.images).join(';');
    const isPremium = getRandomItem(mockData.isPremium);
    const rating = getRandomNumber(GENERATOR_CONFIG.MIN_RATING, GENERATOR_CONFIG.MAX_RATING);
    const type = getRandomItem(mockData.types);
    const room = getRandomNumber(GENERATOR_CONFIG.MIN_ROOM, GENERATOR_CONFIG.MAX_ROOM);
    const bedroom = getRandomNumber(GENERATOR_CONFIG.MIN_BEDROOM, GENERATOR_CONFIG.MAX_BEDROOM);
    const visitor = getRandomNumber(GENERATOR_CONFIG.MIN_VISITOR, GENERATOR_CONFIG.MAX_VISITOR);
    const price = getRandomNumber(GENERATOR_CONFIG.MIN_PRICE, GENERATOR_CONFIG.MAX_PRICE);
    const goods = getRandomItems(mockData.goods).join(';');
    const hostName = getRandomItem(mockData.hostNames);
    const hostEmail = `${randomBytes(10).toString('hex')}-${getRandomItem(mockData.hostEmails)}`;
    const hostAvatar = getRandomItem(mockData.hostAvatarUrls);
    const hostPassword = getRandomItem(mockData.hostPasswords);
    const hostType = getRandomItem(mockData.hostTypes);
    const location = getRandomItem(mockData.locations);

    return [
      title, description, publishDate, city.name, city.location.latitude, city.location.longitude,
      previewImage, images, isPremium, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatar, hostPassword, hostType, location.latitude, location.longitude, visitor
    ].join('\t');
  }

}
