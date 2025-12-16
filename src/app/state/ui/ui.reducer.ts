import { createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';
import { UiState } from './ui.models';

export const UI_FEATURE_KEY = 'ui';

const initialState: UiState = {
    loading: {
        productsList: false,
        productDetails: false,
        checkout: false,
    },
    toasts: [],
};

function uuid(): string {
    return (globalThis.crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export const uiReducer = createReducer(
    initialState,

    on(UiActions.setLoading, (state, { key, isLoading }) => ({
        ...state,
        loading: { ...state.loading, [key]: isLoading },
    })),

    on(UiActions.notify, (state, { toast }) => ({
        ...state,
        toasts: [...state.toasts, toast],
    })),

    on(UiActions.notifySuccess, (state, { message, durationMs }) => ({
        ...state,
        toasts: [...state.toasts, { id: uuid(), type: 'success', message, durationMs }],
    })),
    on(UiActions.notifyError, (state, { message, durationMs }) => ({
        ...state,
        toasts: [...state.toasts, { id: uuid(), type: 'error', message, durationMs }],
    })),
    on(UiActions.notifyInfo, (state, { message, durationMs }) => ({
        ...state,
        toasts: [...state.toasts, { id: uuid(), type: 'info', message, durationMs }],
    })),
    on(UiActions.notifyWarning, (state, { message, durationMs }) => ({
        ...state,
        toasts: [...state.toasts, { id: uuid(), type: 'warning', message, durationMs }],
    })),

    on(UiActions.toastShown, (state, { id }) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
    })),

    on(UiActions.clearToasts, (state) => ({ ...state, toasts: [] })),
);
