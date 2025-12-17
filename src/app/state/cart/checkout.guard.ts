import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { selectCartCount } from './cart.selectors';
import { UiActions } from '../ui/ui.actions';

export const checkoutGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectCartCount).pipe(
        map((count) => {
            if (count <= 0) {
                store.dispatch(
                    UiActions.notifyError({
                        message: 'Your cart is empty. Please add items before checkout.',
                    }),
                );
                router.navigate(['/shop/cart']);
                return false;
            }
            return true;
        }),
    );
};
