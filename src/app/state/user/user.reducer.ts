import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { UserProfile, OrderSummary } from './user.models';

export interface UserState {
    profile: UserProfile | null;
    orders: OrderSummary[];
    selectedOrder: OrderSummary | null;
    loading: boolean;
    error: string | null;
}

export const initialUserState: UserState = {
    profile: null,
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
};

export const userReducer = createReducer(
    initialUserState,

    on(UserActions.loadProfile, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(UserActions.loadProfileSuccess, (state, { profile }) => ({
        ...state,
        profile,
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
    })),

    on(UserActions.loadOrderDetailsSuccess, (state, { order }) => ({
        ...state,
        selectedOrder: order,
        loading: false,
    })),
    
    on(UserActions.loadOrderDetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
);
