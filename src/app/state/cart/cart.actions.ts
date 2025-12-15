import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface CartProduct {
    id: number;
    name: string;
    price: number;
    stock?: number;
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

        setDeliveryMode: props<{ mode: 'free' | 'standard' | 'express' }>(),

        setCartMessage: props<{ message: string }>(),
        clearCartMessage: emptyProps(),
    },
});
