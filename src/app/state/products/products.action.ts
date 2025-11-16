import { createActionGroup, props } from "@ngrx/store";

export interface ProductsSucessResponse {
    count: number;
    results: any[];
}

export const ProductsActions = createActionGroup({
    source: 'Products',
    events: {
        'loadProducts': props<{ page?: number, pageSize?: number, minRating?: number, ordering?: string }>(),
        'loadProductsSuccess': props<{ data: ProductsSucessResponse }>(),
        'loadProductsFailure': props<{ error: string }>(),
    },
});