import {CityName, Location, Offer, SortName} from './types/types';

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];
export const TYPES = ['apartment', 'room', 'house', 'hotel'] as const;
export const GOODS = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
];

export const MARKER_URL = {
  DEFAULT: 'img/pin.svg',
  CURRENT: 'img/pin-active.svg',
};

export const UI_CONFIG = {
  STARS_COUNT: 5,
  MAX_PERCENT_STARS_WIDTH: 100,
  ZOOM: 13,
};

export const COMMENT_CONFIG = {
  MAX_COMMENTS: 10,
  MIN_LENGTH: 50,
  MAX_LENGTH: 300,
};

export enum AppRoute {
  Root = '/',
  Login = '/users/login',
  Register = '/users/',
  Favorites = '/users/favorites',
  Property = '/offers',
  Add = '/offers',
  Edit = '/offers',
  NotFound = '/404',
}

export enum ApiRoute {
  Offers = '/offers',
  Login = '/users/login',
  Logout = '/users/logout',
  Register = '/users',
  Avatar = '/users/avatar',
  Comments = '/comments',
  Favorite = '/offers/favorites',
  Premium = '/offers/premium',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum Sorting {
  Popular = 'Popular',
  PriceIncrease = 'Price: low to high',
  PriceDecrease = 'Price: high to low',
  TopRated = 'Top rated first',
}

export enum UserType {
  Pro = 'pro',
  Regular = 'regular'
}

export enum StoreSlice {
  SiteData = 'SITE_DATA',
  SiteProcess = 'SITE_PROCESS',
  UserProcess = 'USER_PROCESS',
}

export enum HttpCode {
  NotFound = 404,
  NoAuth = 401,
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export enum SubmitStatus {
  Still = 'STILL',
  Pending = 'PENDING',
  Fullfilled = 'FULLFILLED',
  Rejected = 'REJECTED',
}

export const Comparator: {
  [key in SortName]: (a: Offer, b: Offer) => number;
} = {
  Popular: () => 0,
  PriceIncrease: (a, b) => a.price - b.price,
  PriceDecrease: (a, b) => b.price - a.price,
  TopRated: (a, b) => b.rating - a.rating,
};

export const CityLocation: { [key in CityName]: Location } = {
  Paris: {
    latitude: 48.85661,
    longitude: 2.351499,
  },
  Cologne: {
    latitude: 50.938361,
    longitude: 6.959974,
  },
  Brussels: {
    latitude: 50.846557,
    longitude: 4.351697,
  },
  Amsterdam: {
    latitude: 52.37454,
    longitude: 4.897976,
  },
  Hamburg: {
    latitude: 53.550341,
    longitude: 10.000654,
  },
  Dusseldorf: {
    latitude: 51.225402,
    longitude: 6.776314,
  },
};
