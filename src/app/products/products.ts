import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { ProductsActions } from '../state/products/products.action';
import {
  selectProductsList,
  selectProductsCount,
  selectProductsError,
} from '../state/products/products.selectors';
import { selectCartCount } from '../state/cart/cart.selectors';

import { UserActions } from '../state/user/user.actions';
import { selectWishlistProductIds } from '../state/user/user.selectors';

import { selectProductsListLoading } from '../state/ui/ui.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { SideNavComponent } from '../layout/side-nav/side-nav';
import { TableSkeletonComponent } from '../ui/skeletons/table-skeletons/table-skeleton/table-skeleton';

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
    MatIconModule,
    MatPaginatorModule,

    SideNavComponent,
    TableSkeletonComponent,
  ],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private debounce$ = new Subject<void>();

  displayedColumns = ['id', 'name', 'price', 'created_at', 'avg', 'stock', 'wishlist'];

  products$ = this.store.select(selectProductsList);
  count$ = this.store.select(selectProductsCount);
  loading$ = this.store.select(selectProductsListLoading);
  error$ = this.store.select(selectProductsError);
  cartCount$ = this.store.select(selectCartCount);

  wishlistIds$ = this.store.select(selectWishlistProductIds);

  filters = this.fb.group({
    page: 1,
    pageSize: 10,
    minRating: 0,
    ordering: '-created_at',
  });

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.debounce$)).subscribe((params) => {
      const page = Number(params['page'] ?? 1);
      const pageSize = Number(params['pageSize'] ?? 10);
      const minRating = Number(params['minRating'] ?? 0);
      const ordering = String(params['ordering'] ?? '-created_at');

      this.filters.patchValue(
        { page, pageSize, minRating, ordering },
        { emitEvent: false },
      );

      this.onSearch();
    });

    this.filters.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.debounce$))
      .subscribe((values) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: values,
          queryParamsHandling: 'merge',
        });
      });
  }

  ngOnDestroy(): void {
    this.debounce$.next();
    this.debounce$.complete();
  }

  onSearch() {
    const v = this.filters.value;
    this.store.dispatch(
      ProductsActions.loadProducts({
        page: v.page!,
        pageSize: v.pageSize!,
        minRating: v.minRating!,
        ordering: v.ordering!,
      }),
    );
  }

  retry() {
    this.onSearch();
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
  }

  isInWishlist(id: number, wishlistIds: string[]): boolean {
    return wishlistIds.includes(String(id));
  }

  toggleWishlist(id: number, $event: MouseEvent) {
    $event.stopPropagation();
    this.store.dispatch(UserActions.toggleWishlistItem({ productId: String(id) }));
  }

  onRowKeydown(e: KeyboardEvent, id: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.goToRatingProductPage(id);
    }
  }
}
