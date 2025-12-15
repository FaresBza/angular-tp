import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, map, switchMap } from 'rxjs';

import { ProductsActions } from '../state/products/products.action';
import {
  selectProductsList,
  selectProductsLoading,
  selectProductsError,
  selectLastRating,
} from '../state/products/products.selectors';

import { CartActions } from '../state/cart/cart.actions';
import { UserActions } from '../state/user/user.actions';
import { selectIsInWishlist } from '../state/user/user.selectors';

import { ReviewsActions } from '../state/reviews/reviews.actions';
import {
  selectReviewsForProduct,
  selectReviewsLoading,
  selectReviewsError,
  selectAverageRatingForProduct,
  selectReviewsCountForProduct,
} from '../state/reviews/reviews.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SideNavComponent } from '../layout/side-nav/side-nav';

type DisplayRating = {
  avg_rating: number;
  count: number;
  source: 'reviews' | 'api';
};

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AsyncPipe,
    NgIf,
    NgFor,
    NgClass,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    SideNavComponent
  ],
})
export class ProductDetailsPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public Math = Math;

  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

  rating$ = this.store.select(selectLastRating);

  productId$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
  );

  product$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      return this.store.select(selectProductsList).pipe(
        map((products) => products.find((p) => p.id === id) ?? null),
      );
    }),
  );

  isInWishlist$ = this.productId$.pipe(
    switchMap((id) => this.store.select(selectIsInWishlist(String(id)))),
  );

  reviews$ = this.productId$.pipe(
    switchMap((id) => this.store.select(selectReviewsForProduct(id))),
  );
  reviewsLoading$ = this.store.select(selectReviewsLoading);
  reviewsError$ = this.store.select(selectReviewsError);

  avgReviewRating$ = this.productId$.pipe(
    switchMap((id) => this.store.select(selectAverageRatingForProduct(id))),
  );

  reviewCount$ = this.productId$.pipe(
    switchMap((id) => this.store.select(selectReviewsCountForProduct(id))),
  );

  displayRating$ = combineLatest([
    this.rating$,
    this.avgReviewRating$,
    this.reviewCount$,
  ]).pipe(
    map(([apiRating, reviewsAvg, reviewsCount]): DisplayRating => {
      const hasReviews = (reviewsCount ?? 0) > 0;

      if (hasReviews) {
        return {
          avg_rating: Number(reviewsAvg ?? 0),
          count: Number(reviewsCount ?? 0),
          source: 'reviews',
        };
      }

      return {
        avg_rating: Number(apiRating?.avg_rating ?? 0),
        count: Number(apiRating?.count ?? 0),
        source: 'api',
      };
    }),
  );

  ratingStars$ = this.displayRating$.pipe(
    map((r) => Math.round(r.avg_rating)),
  );

  reviewForm = this.fb.group({
    rating: [5, [Validators.required]],
    comment: ['', [Validators.required, Validators.minLength(5)]],
  });

  hoverRating = 0;
  selectedRating = 5;

  setRating(value: number) {
    this.selectedRating = value;
    this.reviewForm.patchValue({ rating: value });

    const stars = document.querySelectorAll('.star.clickable');
    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.remove('pulse');
        void (star as HTMLElement).offsetWidth;
        star.classList.add('pulse');
      }
    });
  }

  setHover(value: number) {
    this.hoverRating = value;
  }

  clearHover() {
    this.hoverRating = 0;
  }


  ngOnInit(): void {
    this.productId$.subscribe((idStr) => {
      if (!idStr) return;

      const idNum = Number(idStr);
      this.store.dispatch(ProductsActions.loadRating({ id: idNum }));
      this.store.dispatch(ReviewsActions.loadProductReviews({ productId: idStr }));
    });
  }

  returnToProductsPage() {
    this.router.navigate(['shop/products']);
  }

  addToCart(product: { id: number; name: string; price: number, stock?: number } | null) {
    if (!product) return;

    this.store.dispatch(
      CartActions.addItem({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
        },
      }),
    );

    this.router.navigate(['shop/products'], {
      queryParams: { added: product.name },
    });
  }

  toggleWishlist(productId: number, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.store.dispatch(
      UserActions.toggleWishlistItem({ productId: String(productId) }),
    );
  }

  submitReview(productId: number) {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const rating = Number(this.reviewForm.value.rating ?? 5);
    const comment = String(this.reviewForm.value.comment ?? '').trim();

    this.store.dispatch(
      ReviewsActions.createReview({
        productId: String(productId),
        rating,
        comment,
      }),
    );

    this.reviewForm.reset({ rating: 5, comment: '' });
  }

  trackByReviewId = (_: number, r: { id: string }) => r.id;

  getStarFillPercent(avg: number, index: number): number {
    const raw = (avg - index) * 100;
    if (raw <= 0) return 0;
    if (raw >= 100) return 100;

    return raw >= 50 ? 50 : 0;
  }

}
