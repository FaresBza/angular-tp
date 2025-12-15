import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, (state) => state.items);
export const selectCartCount = createSelector(selectCartState, (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),);
export const selectCartSubTotal = createSelector(selectCartState, (state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),);
export const selectCouponPercent = createSelector(selectCartState, (state) => state.couponPercent);
export const selectCouponCode = createSelector(selectCartState, (state) => state.couponCode);
export const selectCartMessage = createSelector(selectCartState, (state) => state.message);

export const selectCartDiscount = createSelector(
    selectCartSubTotal,
    selectCouponPercent,
    (subtotal, percent) => subtotal * percent,
);

export const selectCartTotalAfterDiscount = createSelector(
    selectCartSubTotal,
    selectCartDiscount,
    (subtotal, discount) => subtotal - discount,
);

export const selectTaxRate = createSelector(selectCartState, () => 0.077);

export const selectTaxAmount = createSelector(
    selectCartTotalAfterDiscount,
    selectTaxRate,
    (taxable, rate) => taxable * rate,
);

export const selectDeliveryFee = createSelector(selectCartState, (state) => state.deliveryFee);

export const selectCartTotal = createSelector(
    selectCartTotalAfterDiscount,
    selectTaxAmount,
    selectDeliveryFee,
    (afterDiscount, taxes, deliveryFee) => afterDiscount + taxes + deliveryFee,
);
