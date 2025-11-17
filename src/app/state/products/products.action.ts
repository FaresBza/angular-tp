import { createActionGroup, props } from "@ngrx/store";

export interface ProductsSucessResponse {
    count: number;
    results: any[];
}

export interface ProductsQuery {
    page?: number;
    pageSize?: number;
    minRating?: number;
    ordering?: string;
}

export const ProductsActions = createActionGroup({
    source: 'Products',
    events: {
        'loadProducts': props<{ page?: number, pageSize?: number, minRating?: number, ordering?: string }>(),
        'loadProductsSuccess': props<{ data: ProductsSucessResponse }>(),
        'loadProductsFailure': props<{ error: string }>(),
        'selectProduct': props<{ id: number }>(),
        'loadRating': props<{ id: number }>(),
        'loadRatingSuccess': props<{ product_id: number; avg_rating: number; count: number }>(),
    },
});