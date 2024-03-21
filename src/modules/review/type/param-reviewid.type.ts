import {ParamsDictionary} from 'express-serve-static-core';

export type ParamReviewId = {
  reviewId: string;
} | ParamsDictionary;
