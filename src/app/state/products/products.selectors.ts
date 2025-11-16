// src/app/state/products/products.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProductsList = createSelector(selectProductsState, s => s.list);
export const selectProductsCount = createSelector(selectProductsState, s => s.count);
export const selectProductsLoading = createSelector(selectProductsState, s => s.loading);
export const selectProductsError = createSelector(selectProductsState, s => s.error);
export const selectLastRating = createSelector(selectProductsState, s => s.lastRating);
