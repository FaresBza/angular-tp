import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, (state) => state.items);
export const selectCartCount = createSelector(selectCartState, (state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
export const selectCartTotal = createSelector(
    selectCartState, (state) => state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0,
    ),
);

export const selectCouponPercent = createSelector(selectCartState, (state) => state.couponPercent,);

export const selectCartDiscount = createSelector(
    selectCartTotal,
    selectCouponPercent,
    (subtotal, percent) => subtotal * percent,
);

export const selectCartTotalAfterDiscount = createSelector(
    selectCartTotal,
    selectCartDiscount,
    (subtotal, discount) => subtotal - discount,
);
