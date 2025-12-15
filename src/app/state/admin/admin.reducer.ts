import { createReducer, on } from '@ngrx/store';
import { AdminActions } from './admin.actions';
import { AdminState } from './admin.models';

export const initialAdminState: AdminState = {
    summary: null,
    recentOrders: [],
    lowStock: [],
    loading: false,
    error: null,
};

export const adminReducer = createReducer(
    initialAdminState,

    on(AdminActions.loadDashboard, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(AdminActions.loadSummarySuccess, (state, { summary }) => ({
        ...state,
        summary,
        loading: false,
    })),

    on(AdminActions.loadRecentOrdersSuccess, (state, { orders }) => ({
        ...state,
        recentOrders: orders,
        loading: false,
    })),

    on(AdminActions.loadLowStockSuccess, (state, { products }) => ({
        ...state,
        lowStock: products,
        loading: false,
    })),

    on(AdminActions.loadDashboardFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
);
