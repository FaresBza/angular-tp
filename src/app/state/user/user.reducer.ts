import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { UserProfile, OrderDetail, OrderSummary } from './user.models';

export interface UserState {
    profile: UserProfile | null;
    orders: OrderSummary[];
    selectedOrder: OrderDetail | null;
    loading: boolean;
    error: string | null;
}

export const initialState: UserState = {
    profile: null,
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
};

export const userReducer = createReducer(
    initialState,

    on(UserActions.loadProfile, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(UserActions.loadProfileSuccess, (state, { profile }) => ({
        ...state,
        profile,
        orders: profile.orders ?? [],
        loading: false,
    })),
    on(UserActions.loadProfileFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(UserActions.updatePreferences, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(UserActions.updatePreferencesSuccess, (state, { profile }) => ({
        ...state,
        profile,
        orders: profile.orders,
        loading: false,
    })),
    on(UserActions.updatePreferencesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(UserActions.loadOrders, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(UserActions.loadOrdersSuccess, (state, { orders }) => ({
        ...state,
        orders,
        loading: false,
    })),
    on(UserActions.loadOrdersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(UserActions.loadOrderDetails, (state) => ({
        ...state,
        loading: true,
        error: null,
        selectedOrder: null,
    })),
    on(UserActions.loadOrderDetailsSuccess, (state, { order }) => ({
        ...state,
        selectedOrder: order,
        loading: false,
    })),
    on(UserActions.loadOrderDetailsFailure, (state, { error }) => ({
        ...state,
        selectedOrder: null,
        loading: false,
        error,
    })),
);
