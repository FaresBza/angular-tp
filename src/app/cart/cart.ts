import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartSubTotal,
  selectCartCount,
  selectCartDiscount,
  selectCartTotalAfterDiscount,
  selectCartTotal,
  selectDeliveryFee,
} from '../state/cart/cart.selectors';
import { CartActions } from '../state/cart/cart.actions';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { SideNavComponent } from '../layout/side-nav/side-nav';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [NgForOf, NgIf, AsyncPipe, CurrencyPipe, MatCardModule, MatButtonModule, SideNavComponent],
})
export class CartPageComponent {
  private store = inject(Store);
  private router = inject(Router);

  items$ = this.store.select(selectCartItems);
  count$ = this.store.select(selectCartCount);
  subtotal$ = this.store.select(selectCartSubTotal);
  discount$ = this.store.select(selectCartDiscount);
  total$ = this.store.select(selectCartTotalAfterDiscount);
  deliveryFee$ = this.store.select(selectDeliveryFee);
  totalWithFee$ = this.store.select(selectCartTotal);


  promoCode = '';

  remove(productId: number) {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  changeQuantity(productId: number, delta: number, current: number) {
    const next = current + delta;
    if (next < 1) return;
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity: next }));
  }

  clear() {
    this.store.dispatch(CartActions.clearCart());
  }

  goToCheckoutPage() {
    this.router.navigate(['/shop/checkout']);
  }

  applyPromo() {
    this.store.dispatch(
      CartActions.applyCoupon({ code: this.promoCode }),
    );
  }

  setDelivery(mode: 'free' | 'standard' | 'express') {
    this.store.dispatch(CartActions.setDeliveryMode({ mode }));
  }
}