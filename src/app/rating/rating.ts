import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductsActions } from '../state/products/products.action';
import {
  selectLastRating,
  selectProductsError,
  selectProductsLoading,
} from '../state/products/products.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.html',
  styleUrls: ['./rating.css'],
  imports: [AsyncPipe, NgIf, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
})
export class Rating implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  rating$ = this.store.select(selectLastRating);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

  productId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id') ?? '1');
      this.productId = id;
      this.store.dispatch(ProductsActions.loadRating({ id }));
    });
  }
}
