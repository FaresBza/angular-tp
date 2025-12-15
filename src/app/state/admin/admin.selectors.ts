import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.models';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdminLoading = createSelector(selectAdminState, (s) => s.loading);
export const selectAdminError = createSelector(selectAdminState, (s) => s.error);

export const selectAdminSummary = createSelector(selectAdminState, (s) => s.summary);
export const selectAdminRecentOrders = createSelector(selectAdminState, (s) => s.recentOrders);
export const selectAdminLowStock = createSelector(selectAdminState, (s) => s.lowStock);
