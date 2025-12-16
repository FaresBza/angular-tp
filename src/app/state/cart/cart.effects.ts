import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, filter } from 'rxjs';

import { CartActions } from './cart.actions';
import { selectCartMessage } from './cart.selectors';
import { UiActions } from '../ui/ui.actions';

@Injectable()
export class CartEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);

    toastAfterCartActions$ = createEffect(() =>
        this.actions$.pipe(
        ofType(
            CartActions.addItem,
            CartActions.updateQuantity,
            CartActions.applyCoupon,
            CartActions.removeItem,
            CartActions.clearCart,
            CartActions.clearCoupon,
        ),
        withLatestFrom(this.store.select(selectCartMessage)),
        map(([action, message]) => {
            if (message) {
            const isError =
                message.toLowerCase().includes('invalid') ||
                message.toLowerCase().includes('requires') ||
                message.toLowerCase().includes('stock limit');

            return isError
                ? UiActions.notifyError({ message })
                : UiActions.notifySuccess({ message });
            }

            if (action.type === CartActions.addItem.type) {
            const p = (action as ReturnType<typeof CartActions.addItem>).product;
            return UiActions.notifySuccess({ message: `"${p.name}" added to cart ✅` });
            }

            if (action.type === CartActions.removeItem.type) {
            return UiActions.notifyInfo({ message: 'Item removed from cart.' });
            }

            if (action.type === CartActions.clearCart.type) {
            return UiActions.notifyInfo({ message: 'Cart cleared.' });
            }

            if (action.type === CartActions.clearCoupon.type) {
            return UiActions.notifyInfo({ message: 'Promo code cleared.' });
            }

            return UiActions.notifyInfo({ message: 'Cart updated.' });
        }),
        filter(Boolean),
        ),
    );
}
