import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';

import {
  selectWishlistProducts,
  selectWishlistCount,
} from '../state/user/user.selectors';
import { CartActions } from '../state/cart/cart.actions';
import { UserActions } from '../state/user/user.actions';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { SideNavComponent } from '../layout/side-nav/side-nav';
import { ProductDetailsPageComponent } from "../product-details/product-details";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
  imports: [
    NgIf,
    NgForOf,
    DecimalPipe,
    AsyncPipe,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    SideNavComponent,
],
})
export class WishlistPageComponent {
  private store = inject(Store);

  products$ = this.store.select(selectWishlistProducts);
  count$ = this.store.select(selectWishlistCount);

  addToCart(product: { id: number; name: string; price: number }) {
    this.store.dispatch(
      CartActions.addItem({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      }),
    );
  }

  removeFromWishlist(product: { id: number }) {
    this.store.dispatch(
      UserActions.toggleWishlistItem({ productId: String(product.id) }),
    );
  }

  getStarFillPercent(avg: number, index: number): number {
    const value = avg - index;
    if (value <= 0) return 0;
    if (value >= 1) return 100;
    return value * 100;
  }
}
