// src/app/pages/rating/rating.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgClass, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ProductsActions } from '../state/products/products.action';
import {
  selectLastRating,
  selectProductsError,
  selectProductsLoading,
  selectProductsList,
} from '../state/products/products.selectors';

import { CartActions } from '../state/cart/cart.actions';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.html',
  styleUrls: ['./rating.css'],
  imports: [AsyncPipe, NgIf, NgClass, NgFor, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
})
export class ProductRatingPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  public Math = Math;

  rating$ = this.store.select(selectLastRating);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

  product$ = this.route.paramMap.pipe(
  switchMap(params => {
    const id = Number(params.get('id'));
    return this.store.select(selectProductsList).pipe(
      map(products => products.find(p => p.id === id) ?? null)
    );
  })
);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id') ?? '1');
      this.store.dispatch(ProductsActions.loadRating({ id }));
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
    this.router.navigate(['shop/products']);
  }
}
