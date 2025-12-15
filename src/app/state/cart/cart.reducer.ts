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
    message: string | null;
    deliveryMode: 'free' | 'standard' | 'express';
    deliveryFee: number;
}

export const initialCartState: CartState = {
    items: [],
    couponCode: null,
    couponPercent: 0,
    message: null,
    deliveryMode: 'free',
    deliveryFee: 0,
};

function calcSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function capQuantityByStock(product: CartItem['product'], desiredQty: number,): { qty: number; message: string | null } {
    const stock = product.stock;
    if (typeof stock !== 'number') return { qty: desiredQty, message: null };
    if (desiredQty <= stock) return { qty: desiredQty, message: null };
    return {
        qty: Math.max(1, stock),
        message: `Stock limit reached: only ${stock} item(s) left for "${product.name}".`,
    };
}

export const cartReducer = createReducer(
    initialCartState,

    on(CartActions.addItem, (state, { product, quantity }) => {
        const qty = quantity ?? 1;
        const existing = state.items.find((i) => i.product.id === product.id);

        if (existing) {
        const desired = existing.quantity + qty;
        const capped = capQuantityByStock(existing.product, desired);
        return {
            ...state,
            message: capped.message,
            items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: capped.qty } : i,
            ),
        };
        }

        const capped = capQuantityByStock(product, qty);

        return {
        ...state,
        message: capped.message,
        items: [...state.items, { product, quantity: capped.qty }],
        };
    }),

    on(CartActions.removeItem, (state, { productId }) => ({
        ...state,
        items: state.items.filter((i) => i.product.id !== productId),
    })),

    on(CartActions.updateQuantity, (state, { productId, quantity }) => {
        const existing = state.items.find((i) => i.product.id === productId);
        const desired = Math.max(1, quantity);
        if (!existing) return state;

        const capped = capQuantityByStock(existing.product, desired);

        return {
        ...state,
        message: capped.message,
        items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: capped.qty } : i,
        ),
        };
    }),

    on(CartActions.clearCart, (state) => ({
        ...state,
        items: [],
        message: null,
    })),

    on(CartActions.applyCoupon, (state, { code }) => {
        const promoCode = code.trim().toUpperCase();
        const subtotal = calcSubtotal(state.items);

        if (promoCode === 'WELCOME10') {
        return {
            ...state,
            couponCode: promoCode,
            couponPercent: 0.1,
            message: 'Promo applied: -10% (WELCOME10).',
        };
        }

        if (promoCode === 'VIP20') {
        if (subtotal >= 75) {
            return {
            ...state,
            couponCode: promoCode,
            couponPercent: 0.2,
            message: 'Promo applied: -20% (VIP20).',
            };
        }

        return {
            ...state,
            couponCode: null,
            couponPercent: 0,
            message: 'VIP20 requires a subtotal of at least CHF 75.-',
        };
        }

        return {
        ...state,
        couponCode: null,
        couponPercent: 0,
        message: promoCode ? `Invalid promo code: ${promoCode}` : null,
        };
    }),

    on(CartActions.clearCoupon, (state) => ({
        ...state,
        couponCode: null,
        couponPercent: 0,
        message: null,
    })),

    on(CartActions.setCartMessage, (state, { message }) => ({
        ...state,
        message,
    })),

    on(CartActions.clearCartMessage, (state) => ({
        ...state,
        message: null,
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
