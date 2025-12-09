import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { selectProductsList } from '../products/products.selectors';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserProfile = createSelector(selectUserState, (state) => state.profile,);
export const selectUserPreferences = createSelector(selectUserProfile, (profile) => profile?.preferences ?? null,);
export const selectUserOrders = createSelector(selectUserState, (state) => state.orders,);
export const selectUserSelectedOrder = createSelector(selectUserState, (state) => state.selectedOrder,);
export const selectUserLoading = createSelector(selectUserState, (state) => state.loading,);
export const selectUserError = createSelector(selectUserState, (state) => state.error,);


export const selectWishlistProductIds = createSelector(selectUserState, (state) => state.wishlistProductIds,);
export const selectWishlistCount = createSelector(selectWishlistProductIds, (ids) => ids.length,);

export const selectIsInWishlist = (productId: string) =>
    createSelector(selectWishlistProductIds, (ids) =>
        ids.includes(productId),
    );

export const selectWishlistProducts = createSelector(
    selectWishlistProductIds,
    selectProductsList,
    (ids, products) => products.filter((p) => ids.includes(p.id)),
);