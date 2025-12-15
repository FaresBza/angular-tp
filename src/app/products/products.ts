import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf, CurrencyPipe } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { ProductsActions } from '../state/products/products.action';
import {
  selectProductsList,
  selectProductsCount,
  selectProductsLoading,
  selectProductsError,
} from '../state/products/products.selectors';
import { selectCartCount } from '../state/cart/cart.selectors';

import { UserActions } from '../state/user/user.actions';
import { selectWishlistProductIds } from '../state/user/user.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { SideNavComponent } from '../layout/side-nav/side-nav';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule,
    SideNavComponent,
  ],
})
export class ProductsPageComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  displayedColumns = ['id', 'name', 'price', 'created_at', 'avg', 'stock', 'wishlist'];

  products$ = this.store.select(selectProductsList);
  count$ = this.store.select(selectProductsCount);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);
  carCount$ = this.store.select(selectCartCount);

  wishlistIds$ = this.store.select(selectWishlistProductIds);

  notification: string | null = null;

  filters = this.fb.group({
    page: 1,
    pageSize: 10,
    minRating: 0,
    ordering: '-created_at',
  });

  ngOnInit(): void {
    this.onSearch();

    this.route.queryParamMap.subscribe((params) => {
      const addedName = params.get('added');
      if (addedName) {
        this.notification = `${addedName} has successfully added to the cart`;

        setTimeout(() => {
          this.notification = null;
        }, 5000);
      }
    });
  }

  onSearch() {
    this.store.dispatch(
      ProductsActions.loadProducts({
        page: this.filters.value.page!,
        pageSize: this.filters.value.pageSize!,
        minRating: this.filters.value.minRating!,
        ordering: this.filters.value.ordering!,
      }),
    );
  }

  goToRatingProductPage(id: number) {
    this.router.navigate(['/shop/details', id]);
  }

  goToCartPage() {
    this.router.navigate(['/shop/cart']);
  }

  onPaginationChange(event: PageEvent) {
    this.filters.patchValue({
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });

    this.onSearch();
  }

  isInWishlist(id: number, wishlistIds: string[]): boolean {
    return wishlistIds.includes(String(id));
  }

  toggleWishlist(id: number, $event: MouseEvent) {
    $event.stopPropagation();
    this.store.dispatch(
      UserActions.toggleWishlistItem({ productId: String(id) }),
    );
  }
}
