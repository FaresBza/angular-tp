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
        profile: { ...profile, orders: state.orders },
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
        profile: { ...profile, orders: state.orders },
        loading: false,
    })),

    on(UserActions.updatePreferencesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(UserActions.loadOrders, (state) => ({
        ...state,
        loading: false,
        error: null,
    })),

    on(UserActions.createOrderFromCart, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(UserActions.createOrderFromCartSuccess, (state, { order }) => {
        const newOrders = [...state.orders, order];

        return {
        ...state,
        orders: newOrders,
        profile: state.profile
            ? { ...state.profile, orders: newOrders }
            : state.profile,
        loading: false,
        };
    }),

    on(UserActions.createOrderFromCartFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(UserActions.loadOrderDetails, (state, { id }) => {
        const found = state.orders.find((o) => o.id === id) as
        | OrderDetail
        | undefined;

        return {
        ...state,
        loading: false,
        error: found ? null : 'Order not found',
        selectedOrder: found ?? null,
        };
    }),   
);
