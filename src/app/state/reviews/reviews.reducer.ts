import { createReducer, on } from '@ngrx/store';
import { ReviewsActions } from './reviews.actions';
import { ReviewsState } from './reviews.models';

export const initialReviewsState: ReviewsState = {
    byProductId: {},
    loading: false,
    error: null,
};

export const reviewsReducer = createReducer(
    initialReviewsState,

    on(ReviewsActions.init, (state) => ({
        ...state,
        error: null,
    })),

    on(ReviewsActions.loadProductReviews, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(ReviewsActions.loadProductReviewsSuccess, (state, { productId, reviews }) => ({
        ...state,
        loading: false,
        error: null,
        byProductId: {
        ...state.byProductId,
        [productId]: reviews,
        },
    })),

    on(ReviewsActions.loadProductReviewsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(ReviewsActions.createReview, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(ReviewsActions.createReviewSuccess, (state, { productId, review }) => ({
        ...state,
        loading: false,
        error: null,
        byProductId: {
        ...state.byProductId,
        [productId]: [...(state.byProductId[productId] ?? []), review],
        },
    })),

    on(ReviewsActions.createReviewFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
);
