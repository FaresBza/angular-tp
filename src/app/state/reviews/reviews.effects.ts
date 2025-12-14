import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

import { ReviewsActions } from './reviews.actions';
import { Review } from './reviews.models';

@Injectable()
export class ReviewsEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private readonly API = '/api';

    loadProductReviews$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReviewsActions.loadProductReviews),
            switchMap(({ productId }) =>
                this.http
                    .get<Review[]>(`${this.API}/products/${productId}/reviews/`)
                    .pipe(
                        map((reviews) =>
                            ReviewsActions.loadProductReviewsSuccess({ productId, reviews }),
                        ),
                        catchError(() =>
                        of(
                            ReviewsActions.loadProductReviewsFailure({
                                productId,
                                error: 'Failed to load reviews',
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );

    createReview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReviewsActions.createReview),
            switchMap(({ productId, rating, comment }) =>
                this.http
                .post<Review>(`${this.API}/products/${productId}/reviews/`, {
                    rating,
                    comment,
                })
                .pipe(
                    map((review) =>
                        ReviewsActions.createReviewSuccess({ productId, review }),
                    ),
                        catchError(() =>
                        of(
                            ReviewsActions.createReviewFailure({
                            productId,
                            error: 'Failed to create review',
                            }),
                        ),
                    ),
                ),
            ),
        ),
    );
}
