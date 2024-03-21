import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferRepository} from '#src/modules/offer/repository/offer-repository.interface.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {DocumentType, mongoose, Ref, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';


@injectable()
export class MongoOfferRepository implements OfferRepository {
  constructor(
    @inject(Component.OfferModel) private offerModel: types.ModelType<OfferEntity>,
  ) {
  }

  public async create(offerData: OfferEntity): Promise<DocumentType<OfferEntity>> {
    const createdOffer = await this.offerModel.create(offerData);
    return createdOffer.populate(['cityId', 'hostId']);
  }

  public async findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({title: offerTitle});
  }

  public async findAllWithFavorite(limit: number, favoriteOfferIds: Ref<OfferEntity>[], cityId?: string): Promise<DocumentType<OfferEntity>[]> {
    const query = cityId ? {cityId} : {};

    return this.offerModel.aggregate([
      {$match: query},
      {$limit: limit},
      {$sort: {publishDate: -1}},
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'hostId',
          foreignField: '_id',
          as: 'host'
        }
      },
      {$unwind: '$city'},
      {$unwind: '$host'},
      {
        $addFields: {
          isFavorite: {
            $in: ['$_id', favoriteOfferIds]
          },
          id: {$toString: '$_id'}
        }
      }
    ]);
  }

  public async findByIdWithFavorite(offerIdRef: Ref<OfferEntity>, favoriteOfferIds: Ref<OfferEntity>[]): Promise<DocumentType<OfferEntity> | null> {
    const offerObjectId = new mongoose.Types.ObjectId(offerIdRef.toString());

    return this.offerModel.aggregate([
      {$match: {_id: offerObjectId}},
      {$limit: 1},
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'hostId',
          foreignField: '_id',
          as: 'host'
        }
      },
      {$unwind: '$city'},
      {$unwind: '$host'},
      {
        $addFields: {
          isFavorite: {
            $in: ['$_id', favoriteOfferIds]
          },
          id: {$toString: '$_id'}
        }
      }
    ]).then((results) => results[0] || null);
  }

  public async findFavorite(limit: number, favoriteOfferIds: Ref<OfferEntity>[]): Promise<DocumentType<OfferEntity>[]> {

    return this.offerModel.aggregate([
      {$match: {_id: {$in: favoriteOfferIds}}},
      {$limit: limit},
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'hostId',
          foreignField: '_id',
          as: 'host'
        }
      },
      {$unwind: '$city'},
      {$unwind: '$host'},
      {
        $addFields: {
          isFavorite: {
            $in: ['$_id', favoriteOfferIds]
          },
          id: {$toString: '$_id'}
        }
      }
    ]);
  }

  public async findPremiumByCity(cityId: string, limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({cityId, isPremium: true}, {}, {limit: limit})
      .sort({publishDate: -1})
      .populate(['cityId', 'hostId']);
  }

  public async findById(offerIdRef: Ref<OfferEntity>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerIdRef)
      .populate(['cityId', 'hostId']);
  }

  public async findByIds(offerIds: Ref<OfferEntity>[], limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({_id: {$in: offerIds}}, {}, {limit})
      .sort({publishDate: -1})
      .populate(['cityId', 'hostId']);
  }

  public async deleteById(offerIdRef: Ref<OfferEntity>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerIdRef)
      .populate(['cityId', 'hostId']);
  }

  public async updateById(offerIdRef: Ref<OfferEntity>, offerData: Partial<Offer>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerIdRef, offerData)
      .populate(['cityId', 'hostId']);
  }

  public async exists(offerId: MongooseObjectId): Promise<boolean> {
    const isOfferExists = await this.offerModel.exists({_id: offerId});
    return !!isOfferExists;
  }

  public async incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const updatedOffer = await this.offerModel.findByIdAndUpdate(offerIdRef, {'$inc': {reviewCount: 1}}, {new: true});
    return !!updatedOffer;
  }

  public async updateRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean> {
    const updatedOffer = await this.offerModel.findByIdAndUpdate(offerIdRef, {rating: averageRating}, {new: true});
    return !!updatedOffer;
  }
}
