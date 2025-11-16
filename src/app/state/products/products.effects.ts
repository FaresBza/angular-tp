import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductsActions, ProductsSucessResponse } from './products.action';
import { catchError, map, switchMap, of } from 'rxjs';

@Injectable()
export class ProductsEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    loadProducts$ = createEffect(() =>
        this.actions$.pipe(
        ofType(ProductsActions.loadProducts),
        switchMap(() =>
            this.http.get<ProductsSucessResponse>('/api/products/').pipe(
            map((data) => ProductsActions.loadProductsSuccess({ data })),
            catchError((err) =>
                of(ProductsActions.loadProductsFailure({ error: err?.message ?? 'Load failed' }))
            )
            )
        )
        )
    );
}
