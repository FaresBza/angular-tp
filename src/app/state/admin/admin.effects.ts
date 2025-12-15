import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, merge, of, switchMap } from 'rxjs';

import { AdminActions } from './admin.actions';
import { AdminLowStockProduct, AdminRecentOrder, AdminSummary } from './admin.models';

@Injectable()
export class AdminEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    loadDashboard$ = createEffect(() =>
        this.actions$.pipe(
        ofType(AdminActions.loadDashboard),
        switchMap(({ limit }) => {
            const params = new HttpParams().set('limit', String(limit ?? 10));

            const summary$ = this.http.get<AdminSummary>('/api/admin/summary/').pipe(
            map((summary) => AdminActions.loadSummarySuccess({ summary })),
            );

            const recent$ = this.http.get<AdminRecentOrder[]>('/api/admin/orders/recent/', { params }).pipe(
            map((orders) => AdminActions.loadRecentOrdersSuccess({ orders })),
            );

            const lowStock$ = this.http.get<AdminLowStockProduct[]>('/api/admin/products/low-stock/').pipe(
            map((products) => AdminActions.loadLowStockSuccess({ products })),
            );

            return merge(summary$, recent$, lowStock$).pipe(
            catchError(() => of(AdminActions.loadDashboardFailure({ error: 'Failed to load admin dashboard' }))),
            );
        }),
        ),
    );
}
