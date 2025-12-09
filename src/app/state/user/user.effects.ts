import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserActions } from './user.actions';
import {
    UserProfile,
    UserPreferences,
    OrderDetail,
} from './user.models';
import {
    selectCartItems,
    selectCartSubTotal,
    selectCartDiscount,
    selectDeliveryFee,
    selectCartTotal,
} from '../cart/cart.selectors';

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private store = inject(Store);

    private readonly API = '/api';

    loadProfile$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.loadProfile),
        switchMap(() =>
            this.http.get<UserProfile>(`${this.API}/me/`).pipe(
            map((profile) => UserActions.loadProfileSuccess({ profile })),
            catchError(() =>
                of(
                UserActions.loadProfileFailure({
                    error: 'Failed to load profile',
                }),
                ),
            ),
            ),
        ),
        ),
    );

    updatePreferences$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.updatePreferences),
        switchMap(({ preferences }) =>
            this.http
            .patch<UserProfile>(`${this.API}/me/`, {
                preferences: preferences as Partial<UserPreferences>,
            })
            .pipe(
                map((profile) =>
                UserActions.updatePreferencesSuccess({ profile }),
                ),
                catchError(() =>
                of(
                    UserActions.updatePreferencesFailure({
                    error: 'Failed to update preferences',
                    }),
                ),
                ),
            ),
        ),
        ),
    );

    // --- 🔥 Nouvelle logique : création d’une commande à partir du panier ---

    createOrderFromCart$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.createOrderFromCart),
        withLatestFrom(
            this.store.select(selectCartItems),
            this.store.select(selectCartSubTotal),
            this.store.select(selectCartDiscount),
            this.store.select(selectDeliveryFee),
            this.store.select(selectCartTotal),
        ),
        map(([action, items, subtotal, discount, shipping, grandTotal]) => {
            const order: OrderDetail = {
            id: action.id,
            createdAt: new Date().toISOString(),
            status: 'pending',
            total: grandTotal,
            currency: 'CHF',
            items: items.map((cartItem) => ({
                productId: cartItem.product.id,
                name: cartItem.product.name,
                unitPrice: cartItem.product.price,
                quantity: cartItem.quantity,
                total: cartItem.product.price * cartItem.quantity,
            })),
            subtotal,
            discount,
            shipping,
            taxes: 0,
            grandTotal,
            shippingAddress: action.shippingAddress,
            };

            return UserActions.createOrderFromCartSuccess({ order });
        }),
        catchError(() =>
            of(
            UserActions.createOrderFromCartFailure({
                error: 'Failed to create order',
            }),
            ),
        ),
        ),
    );

  // ⚠️ IMPORTANT :
  // On n’a plus d’effets loadOrders$ / loadOrderDetails$ ici.
  // Donc plus AUCUN appel HTTP aux mocks pour les orders.
}
