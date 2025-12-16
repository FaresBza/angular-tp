import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UI_FEATURE_KEY } from './ui.reducer';
import { UiState } from './ui.models';

export const selectUiState = createFeatureSelector<UiState>(UI_FEATURE_KEY);

export const selectLoading = createSelector(selectUiState, (s) => s.loading);

export const selectProductsListLoading = createSelector(selectLoading, (l) => l.productsList);
export const selectProductDetailsLoading = createSelector(selectLoading, (l) => l.productDetails);
export const selectCheckoutLoading = createSelector(selectLoading, (l) => l.checkout);

export const selectToasts = createSelector(selectUiState, (s) => s.toasts);
export const selectNextToast = createSelector(selectToasts, (toasts) => toasts[0] ?? null);
