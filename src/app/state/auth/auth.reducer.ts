import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
    access: string | null;
    refresh: string | null;
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    loading: boolean;
    error: string | null;
}

function readToken(key: 'access' | 'refresh'): string | null {
    try {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(`auth.${key}`);
    } catch {
        return null;
    }
}

export const initialState: AuthState = {
    access: readToken('access'),
    refresh: readToken('refresh'),
    firstname: null,
    lastname: null,
    email: null,
    loading: false,
    error: null,
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.hydrateFromStorage, (state) => ({
        ...state,
        access: readToken('access'),
        refresh: readToken('refresh'),
    })),

    on(AuthActions.login, (state, { firstname, lastname, email }) => ({
        ...state,
        firstname,
        lastname,
        email,
        loading: true,
        error: null,
    })),

    on(AuthActions.loginSuccess, (state, { access, refresh }) => ({
        ...state,
        access,
        refresh,
        loading: false,
        error: null,
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(AuthActions.refreshToken, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(AuthActions.refreshSuccess, (state, { access }) => ({
        ...state,
        access,
        loading: false,
        error: null,
    })),

    on(AuthActions.refreshFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        access: null, // 🔥 access invalide
    })),

    on(AuthActions.logout, (state) => ({
        ...state,
        access: null,
        refresh: null,
        loading: false,
        error: null,
    })),
);
