import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Review } from './reviews.models';

export const ReviewsActions = createActionGroup({
  source: 'Reviews',
  events: {
    init: emptyProps(),

    loadProductReviews: props<{ productId: string }>(),
    loadProductReviewsSuccess: props<{ productId: string; reviews: Review[] }>(),
    loadProductReviewsFailure: props<{ productId: string; error: string }>(),

    createReview: props<{ productId: string; rating: number; comment: string }>(),
    createReviewSuccess: props<{ productId: string; review: Review }>(),
    createReviewFailure: props<{ productId: string; error: string }>(),
  },
});
