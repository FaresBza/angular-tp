import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CartProduct {
    id: number;
    name: string;
    price: number;
}

export const CartActions = createActionGroup({
    source: 'Cart',
    events: {
        addItem: props<{ product: CartProduct; quantity?: number }>(),
        removeItem: props<{ productId: number }>(),
        updateQuantity: props<{ productId: number; quantity: number }>(),
        clearCart: emptyProps(),
        applyCoupon: props<{ code: string }>(),
        clearCoupon: emptyProps(),
    },
});
