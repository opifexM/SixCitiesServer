import {UserType} from '../const';
import {CityDTO} from '../dto/city.dto';
import {LocationDTO} from '../dto/location.dto';
import {OfferShortDTO} from '../dto/offer-short.dto';
import {OfferDTO} from '../dto/offer.dto';
import {ReviewDTO} from '../dto/review.dto';
import {UserTypeDTO} from '../dto/user-type.dto';
import {UserDTO} from '../dto/user.dto';
import {City, Comment, Location, Offer, User} from '../types/types';

export function adaptLocationToClient(locationDTO: LocationDTO): Location {
  return {
    latitude: locationDTO.latitude,
    longitude: locationDTO.longitude,
  };
}

export function adaptCityToClient(cityDTO: CityDTO): City {
  return {
    name: cityDTO.name,
    location: adaptLocationToClient(cityDTO.location)
  };
}

function adaptUserTypeToClient(userTypeDTO: UserTypeDTO): UserType {
  switch (userTypeDTO) {
    case UserTypeDTO.basic:
      return UserType.Regular;
    case UserTypeDTO.pro:
      return UserType.Pro;
    default:
      return UserType.Regular;
  }
}

export function adaptUserToClient(userDTO: UserDTO): User {
  return {
    name: userDTO.name,
    avatarUrl: userDTO.avatarUrl,
    type: adaptUserTypeToClient(userDTO.type),
    email: userDTO.email,
  };
}

export function adaptOfferToClient(offerDTO: OfferDTO): Offer {
  return {
    id: offerDTO.id,
    price: offerDTO.price,
    rating: offerDTO.rating,
    title: offerDTO.title,
    isPremium: offerDTO.isPremium,
    isFavorite: offerDTO.isFavorite,
    previewImage: offerDTO.previewImage,
    bedrooms: offerDTO.bedroom,
    description: offerDTO.description,
    goods: offerDTO.goods,
    images: offerDTO.images,
    maxAdults: offerDTO.visitor,
    type: offerDTO.type,
    location: adaptLocationToClient(offerDTO.location),
    city: adaptCityToClient(offerDTO.city),
    host: adaptUserToClient(offerDTO.host)
  };
}

export function adaptOfferShortToClient(offerShortDTO: OfferShortDTO): Offer {
  return {
    id: offerShortDTO.id,
    price: offerShortDTO.price,
    rating: offerShortDTO.rating,
    title: offerShortDTO.title,
    isPremium: offerShortDTO.isPremium,
    isFavorite: offerShortDTO.isFavorite,
    previewImage: offerShortDTO.previewImage,
    bedrooms: 0,
    description: '',
    goods: [],
    images: [],
    maxAdults: 0,
    type: offerShortDTO.type,
    location: adaptLocationToClient(offerShortDTO.location),
    city: adaptCityToClient(offerShortDTO.city),
    host: {
      name: '',
      avatarUrl: '',
      type: UserType.Regular,
      email: '',
    }
  };
}

export function adaptCommentToClient(reviewDTO: ReviewDTO): Comment {
  return {
    id: reviewDTO.id,
    comment: reviewDTO.comment,
    date: reviewDTO.publishDate.toString(),
    rating: reviewDTO.rating,
    user: adaptUserToClient(reviewDTO.author)
  };
}

export function adaptOffersToClient(offerDTOs: OfferDTO[]): Offer[] {
  return offerDTOs.map(((offerDTO) => adaptOfferToClient(offerDTO)));
}

export function adaptOffersShortToClient(offerShorDTOs: OfferShortDTO[]): Offer[] {
  return offerShorDTOs.map(((offerDTO) => adaptOfferShortToClient(offerDTO)));
}

export function adaptCommentsToClient(commentDTOs: ReviewDTO[]): Comment[] {
  return commentDTOs.map(((reviewDTO) => adaptCommentToClient(reviewDTO)));
}

export function adaptCitiesToClient(cityDTOs: CityDTO[]): City[] {
  return cityDTOs.map(((cityDTO) => adaptCityToClient(cityDTO)));
}
