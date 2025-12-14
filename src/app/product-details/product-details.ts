import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, of, switchMap } from 'rxjs';

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

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SideNavComponent,
    RouterLink,
    NgClass,
    AsyncPipe,
    NgIf,
    NgFor,
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

  product$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      return this.store.select(selectProductsList).pipe(
        map((products) => products.find((p) => p.id === id) ?? null),
      );
    }),
  );

  isInWishlist$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.store.select(selectIsInWishlist(String(id))) : of(false);
    }),
  );

  productId$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
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

  reviewForm = this.fb.group({
    rating: [5, [Validators.required]],
    comment: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.productId$.subscribe((idStr) => {
      if (!idStr) return;

      const idNum = Number(idStr);
      this.store.dispatch(ProductsActions.loadRating({ id: idNum }));

      this.store.dispatch(ReviewsActions.loadProductReviews({ productId: idStr }));
    });
  }

  addToCart(product: { id: number; name: string; price: number } | null) {
    if (!product) return;

    this.store.dispatch(
      CartActions.addItem({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
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

  submitReview(productId: number | null) {
    if (!productId) return;
    if (this.reviewForm.invalid) return;

    const rating = Number(this.reviewForm.value.rating ?? 5);
    const comment = String(this.reviewForm.value.comment ?? '').trim();

    this.store.dispatch(
      ReviewsActions.createReview({
        productId: String(productId),
        rating,
        comment,
      }),
    );

    this.reviewForm.patchValue({ comment: '' });
  }

  trackByReviewId = (_: number, r: { id: string }) => r.id;

  returnToProductsPage() {
    this.router.navigate(['shop/products']);
  }
}
