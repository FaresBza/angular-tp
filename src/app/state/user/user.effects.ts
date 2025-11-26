import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, switchMap } from 'rxjs';
import { UserActions } from './user.actions';
import { UserProfile, UserPreferences, OrderSummary, OrderDetail } from './user.models';

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    private readonly API = '/api';

    loadProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadProfile),
            switchMap(() =>
                this.http.get<UserProfile>(`${this.API}/me/`).pipe(
                map((profile) => UserActions.loadProfileSuccess({ profile })),
                    catchError(() =>
                        of(UserActions.loadProfileFailure({ error: 'Failed to load profile' })),
                    ),
                ),
            ),
        ),
    );

    updatePreferences$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updatePreferences),
            switchMap(({ preferences }) =>
                this.http.patch<UserProfile>(`${this.API}/me/`, {
                    preferences: preferences as Partial<UserPreferences>,
                }).pipe(
                    map((profile) => UserActions.updatePreferencesSuccess({ profile })),
                    catchError(() =>
                        of(UserActions.updatePreferencesFailure({ error: 'Failed to update preferences' })),
                    ),
                ),
            ),
        ),
    );

    loadOrders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadOrders),
            switchMap(() =>
                this.http.get<OrderSummary[]>(`${this.API}/me/orders/`).pipe(
                    map((orders) => UserActions.loadOrdersSuccess({ orders })),
                    catchError(() =>
                        of(UserActions.loadOrdersFailure({ error: 'Failed to load orders' })),
                    ),
                ),
            ),
        ),
    );

    loadOrderDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadOrderDetails),
            switchMap(({ id }) =>
                this.http.get<OrderDetail>(`${this.API}/orders/${id}/`).pipe(
                map((order) => UserActions.loadOrderDetailsSuccess({ order })),
                    catchError(() =>
                        of(UserActions.loadOrderDetailsFailure({ error: 'Failed to load order details' })),
                    ),
                ),
            ),
        ),
    );
}
