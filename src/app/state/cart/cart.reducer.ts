import { createReducer, on } from '@ngrx/store';
import { CartActions, CartProduct } from './cart.actions';

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
}

export const initialCartState: CartState = {
    items: [],
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
);
