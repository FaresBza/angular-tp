import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserProfile = createSelector(selectUserState, (state) => state.profile,);
export const selectUserPreferences = createSelector(selectUserProfile, (profile) => profile?.preferences ?? null,);
export const selectUserOrders = createSelector(selectUserState, (state) => state.orders,);
export const selectUserSelectedOrder = createSelector(selectUserState, (state) => state.selectedOrder,);
export const selectUserLoading = createSelector(selectUserState, (state) => state.loading,);
export const selectUserError = createSelector(selectUserState, (state) => state.error,);
