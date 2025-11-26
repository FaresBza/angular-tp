// src/app/state/user/user.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

import { UserActions } from './user.actions';
import { UserProfile, OrderSummary } from './user.models';

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    /**
     * Charge le profil utilisateur : GET /api/me/
     */
    loadProfile$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.loadProfile),
        switchMap(() =>
            this.http.get<UserProfile>('/api/me/').pipe(
            map((profile) => UserActions.loadProfileSuccess({ profile })),
            catchError((err) =>
                of(
                UserActions.loadProfileFailure({
                    error: err?.message ?? 'Load profile failed',
                }),
                ),
            ),
            ),
        ),
        ),
    );

    /**
     * Met à jour les préférences : PATCH /api/me/
     */
    updatePreferences$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.updatePreferences),
        switchMap(({ preferences }) =>
            this.http
            .patch<UserProfile>('/api/me/', { preferences })
            .pipe(
                map((profile) =>
                UserActions.updatePreferencesSuccess({ profile }),
                ),
                catchError((err) =>
                of(
                    UserActions.updatePreferencesFailure({
                    error: err?.message ?? 'Update preferences failed',
                    }),
                ),
                ),
            ),
        ),
        ),
    );

    /**
     * Charge l’historique de commandes : GET /api/me/orders/
     */
    loadOrders$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.loadOrders),
        switchMap(() =>
            this.http.get<OrderSummary[]>('/api/me/orders/').pipe(
            map((orders) => UserActions.loadOrdersSuccess({ orders })),
            catchError((err) =>
                of(
                UserActions.loadOrdersFailure({
                    error: err?.message ?? 'Load orders failed',
                }),
                ),
            ),
            ),
        ),
        ),
    );

    /**
     * Charge le détail d’une commande : GET /api/orders/:id/
     */
    loadOrderDetails$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.loadOrderDetails),
        switchMap(({ id }) =>
            this.http.get<OrderSummary>(`/api/orders/${id}/`).pipe(
            map((order) =>
                UserActions.loadOrderDetailsSuccess({ order }),
            ),
            catchError((err) =>
                of(
                UserActions.loadOrderDetailsFailure({
                    error: err?.message ?? 'Load order details failed',
                }),
                ),
            ),
            ),
        ),
        ),
    );
}
