import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  map,
  of,
  switchMap,
  withLatestFrom,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';

import { UserActions } from './user.actions';
import { UserProfile, UserPreferences, OrderDetail } from './user.models';

import {
  selectCartItems,
  selectCartSubTotal,
  selectCartDiscount,
  selectDeliveryFee,
  selectCartTotal,
  selectTaxAmount,
} from '../cart/cart.selectors';
import { UserState } from './user.reducer';
import { selectWishlistProductIds } from './user.selectors';

import { UiActions } from '../ui/ui.actions';
import { CartActions } from '../cart/cart.actions';

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private store = inject<Store<{ user: UserState }>>(Store);

    private readonly API = '/api';
    private readonly WISHLIST_STORAGE_KEY = 'myshop_wishlist';

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
              map((profile) => UserActions.updatePreferencesSuccess({ profile })),
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

    // ====== CHECKOUT loader ======
    checkoutLoadingOn$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createOrderFromCart),
        map(() => UiActions.setLoading({ key: 'checkout', isLoading: true })),
      ),
    );

    checkoutLoadingOff$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createOrderFromCartSuccess, UserActions.createOrderFromCartFailure),
        map(() => UiActions.setLoading({ key: 'checkout', isLoading: false })),
      ),
    );

    // ====== Create Order (mock local) ======
    createOrderFromCart$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createOrderFromCart),
        withLatestFrom(
          this.store.select(selectCartItems),
          this.store.select(selectCartSubTotal),
          this.store.select(selectCartDiscount),
          this.store.select(selectDeliveryFee),
          this.store.select(selectTaxAmount),
          this.store.select(selectCartTotal),
        ),
        map(([action, items, subtotal, discount, shipping, taxes, grandTotal]) => {
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
            taxes,
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

    orderSuccessToast$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createOrderFromCartSuccess),
        map(({ order }) => UiActions.notifySuccess({ message: `Order validated ✅ (${order.id})` })),
      ),
    );

    orderFailureToast$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createOrderFromCartFailure),
        map(({ error }) => UiActions.notifyError({ message: error || 'Order failed' })),
      ),
    );

    // Optionnel (très utile UX): vider le panier après succès
    clearCartAfterOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createOrderFromCartSuccess),
        map(() => CartActions.clearCart()),
      ),
    );

    // ====== Wishlist local storage ======
    initWishlist$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UserActions.initWishlist),
        map(() => {
            try {
              const raw = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
              const parsed = raw ? (JSON.parse(raw) as string[]) : [];
              return UserActions.setWishlist({ productIds: parsed });
            } catch {
              return UserActions.setWishlist({ productIds: [] });
            }
        }),
      ),
    );

    toggleWishlistItem$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.toggleWishlistItem),
        withLatestFrom(this.store.select(selectWishlistProductIds)),
        switchMap(([{ productId }, currentIds]) => {
            const exists = currentIds.includes(productId);
            const nextIds = exists
            ? currentIds.filter((id) => id !== productId)
            : [...currentIds, productId];

          return of(
            UserActions.setWishlist({ productIds: nextIds }),
            exists
              ? UiActions.notifyInfo({ message: 'Removed from wishlist.' })
              : UiActions.notifySuccess({ message: 'Added to wishlist ❤️' }),
          );
        }),
        catchError(() =>
          of(
            UserActions.toggleWishlistItemFailure({
              error: 'Failed to update wishlist',
            }),
            UiActions.notifyError({ message: 'Failed to update wishlist' }),
          ),
        ),
      ),
    );

    persistWishlist$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(UserActions.setWishlist),
          tap(({ productIds }) => {
            try {
              localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
            } catch {}
          }),
        ),
      { dispatch: false },
    );
}
