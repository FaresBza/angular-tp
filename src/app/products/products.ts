import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { ProductsActions } from '../state/products/products.action';
import {
  selectProductsList,
  selectProductsCount,
  selectProductsLoading,
  selectProductsError,
} from '../state/products/products.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
})
export class Products implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  displayedColumns = ['id', 'name', 'price', 'created_at', 'avg'];

  products$ = this.store.select(selectProductsList);
  count$ = this.store.select(selectProductsCount);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

  filters = this.fb.group({
    page: 1,
    pageSize: 10,
    minRating: 0,
    ordering: '-created_at',
  });

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.store.dispatch(
      ProductsActions.loadProducts({
        page: this.filters.value.page!,
        pageSize: this.filters.value.pageSize!,
        minRating: this.filters.value.minRating!,
        ordering: this.filters.value.ordering!,
      })
    );
  }

  goToRatingProductPage(id: number) {
    this.router.navigate(['/shop/rating', id]);
  }
}
