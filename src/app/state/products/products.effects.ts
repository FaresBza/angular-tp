// src/app/state/products/products.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductsActions, ProductsQuery, ProductsSucessResponse } from './products.action';
import { catchError, map, of, switchMap } from 'rxjs';
import { UiActions } from '../ui/ui.actions';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  productsListLoadingOn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      map(() => UiActions.setLoading({ key: 'productsList', isLoading: true })),
    ),
  );

  productsListLoadingOff$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProductsSuccess, ProductsActions.loadProductsFailure),
      map(() => UiActions.setLoading({ key: 'productsList', isLoading: false })),
    ),
  );

  productsListErrorToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProductsFailure),
      map(({ error }) => UiActions.notifyError({ message: error || 'Failed to load products' })),
    ),
  );

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap((query) =>
        this.http
          .get<ProductsSucessResponse>('/api/products/', { params: buildFilterParams(query) })
          .pipe(
            map((data) => ProductsActions.loadProductsSuccess({ data })),
            catchError((err) =>
              of(ProductsActions.loadProductsFailure({ error: err?.message ?? 'Load failed' })),
            ),
          ),
      ),
    ),
  );

  loadRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadRating),
      switchMap(({ id }) =>
        this.http
          .get<{ product_id: number; avg_rating: number; count: number }>(`/api/products/${id}/rating/`)
          .pipe(
            map((r) => ProductsActions.loadRatingSuccess(r)),
            catchError((err) =>
              of(ProductsActions.loadProductsFailure({ error: err?.message ?? 'Rating failed' })),
            ),
          ),
      ),
    ),
  );
}

/**
 * Construit les paramètres de requête HTTP à partir des filtres produits.
 * @param p Filtres fournis par l'utilisateur (page, pageSize, minRating, ordering)
 * @returns HttpParams contenant uniquement les filtres définis
 */
function buildFilterParams(p: ProductsQuery): HttpParams {
  let params = new HttpParams();

  if (p.page !== undefined && p.page !== null) params = params.set('page', String(p.page));
  if (p.pageSize !== undefined && p.pageSize !== null) params = params.set('page_size', String(p.pageSize));
  if (p.minRating !== undefined && p.minRating !== null) params = params.set('min_rating', String(p.minRating));
  if (p.ordering) params = params.set('ordering', p.ordering);

  return params;
}
