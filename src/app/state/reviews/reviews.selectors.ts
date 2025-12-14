import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.models';

export const selectReviewsState = createFeatureSelector<ReviewsState>('reviews');

export const selectReviewsLoading = createSelector(selectReviewsState, (s) => s.loading,);
export const selectReviewsError = createSelector(selectReviewsState, (s) => s.error,);
export const selectReviewsForProduct = (productId: string) => createSelector(selectReviewsState, (s) => s.byProductId[productId] ?? []);
export const selectReviewsCountForProduct = (productId: string) => createSelector(selectReviewsForProduct(productId), (reviews) => reviews.length);

export const selectAverageRatingForProduct = (productId: string) =>
    createSelector(selectReviewsForProduct(productId), (reviews) => {
        if (!reviews.length) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / reviews.length;
    }
);
