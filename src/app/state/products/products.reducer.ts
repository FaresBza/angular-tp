// src/app/state/products/products.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { ProductsActions } from './products.action';

export interface ProductsAuth {
    list: any[];
    count: number;
    loading: boolean;
    error: string | null;
    lastRating: { product_id: number; avg_rating: number; count: number } | null;
}

export const initialState: ProductsAuth = {
    list: [],
    count: 0,
    loading: false,
    error: null,
    lastRating: null,
};

export const productsReducer = createReducer(
    initialState,
    on(ProductsActions.loadProducts, (state, query) => ({
        ...state,
        loading: true,
        error: null,
        lastQuery: { ...query },
    })),
    on(ProductsActions.loadProductsSuccess, (state, { data }) => ({
        ...state,
        loading: false,
        list: data.results,
        count: data.count,
    })),
    on(ProductsActions.loadProductsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(ProductsActions.loadRating, state => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(ProductsActions.loadRatingSuccess, (state, rating) => ({
        ...state,
        loading: false,
        lastRating: rating,
    })),
);
