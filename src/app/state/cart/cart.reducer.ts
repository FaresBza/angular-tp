import { createReducer, on } from '@ngrx/store';
import { CartActions, CartProduct } from './cart.actions';

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    couponCode: string | null;
    couponPercent: number;
    deliveryMode: 'free' | 'standard' | 'express';
    deliveryFee: number;
}

export const initialCartState: CartState = {
    items: [],
    couponCode: null,
    couponPercent: 0,
    deliveryMode: 'free',
    deliveryFee: 0,
};

export const cartReducer = createReducer(
    initialCartState,
    on(CartActions.addItem, (state, { product, quantity }) => {
        const qty = quantity ?? 1;
        const existing = state.items.find((i) => i.product.id === product.id);

        if (existing) {
            return {
                ...state,
                items: state.items.map((i) =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i,
                ),
            };
        }

        return {
            ...state,
            items: [...state.items, { product, quantity: qty }],
        };
    }),

    on(CartActions.removeItem, (state, { productId }) => ({
        ...state,
        items: state.items.filter((i) => i.product.id !== productId),
    })),

    on(CartActions.updateQuantity, (state, { productId, quantity }) => {
        const q = Math.max(1, quantity);
        return {
            ...state,
            items: state.items.map((i) =>
                i.product.id === productId ? { ...i, quantity: q } : i,
            ),
        };
    }),

    on(CartActions.clearCart, (state) => ({
        ...state,
        items: [],
    })),

    on(CartActions.applyCoupon, (state, { code }) => {
        const promoCode = code.trim().toUpperCase();

        if (promoCode === 'ANGULAR2025') {
        return {
            ...state,
            couponCode: promoCode,
            couponPercent: 0.2,
            };
        }

        return {
        ...state,
        couponCode: null,
        couponPercent: 0,
        };
    }),

    on(CartActions.clearCoupon, (state) => ({
        ...state,
        couponCode: null,
        couponPercent: 0,
    })),

    on(CartActions.setDeliveryMode, (state, { mode }) => {
        let fee = 0;
        if (mode === 'standard') fee = 4.99;
        if (mode === 'express') fee = 9.99;

        return {
            ...state,
            deliveryMode: mode,
            deliveryFee: fee,
        };
    }),
);
