import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

interface LoginRes {
    access: string;
    refresh: string;
}
interface RefreshRes {
    access: string;   
}

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    login$ = createEffect(() =>
        this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ firstname, lastname, email, password }) =>
            this.http.post<LoginRes>('/api/auth/token/', { firstname, lastname, email, password }).pipe(
            map(({ access, refresh }) => AuthActions.loginSuccess({ access, refresh })),
            catchError((err) =>
                of(AuthActions.loginFailure({ error: err?.message ?? 'Login failed' })),
            ),
            ),
        ),
        ),
    );

    persistTokens$ = createEffect(
        () =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap(({ access, refresh }) => {
            try {
                localStorage.setItem('auth.access', access);
                localStorage.setItem('auth.refresh', refresh);
            } catch {}
            }),
        ),
        { dispatch: false },
    );

    refresh$ = createEffect(() =>
        this.actions$.pipe(
        ofType(AuthActions.refreshToken),
        switchMap(() =>
            this.http.post<RefreshRes>('/api/auth/token/refresh/', {}).pipe(
            map(({ access }) => AuthActions.refreshSuccess({ access })),
            catchError(() =>
                of(AuthActions.refreshFailure({ error: 'Refresh failed' })),
            ),
            ),
        ),
        ),
    );

    persistAccessOnRefresh$ = createEffect(
        () =>
        this.actions$.pipe(
            ofType(AuthActions.refreshSuccess),
            tap(({ access }) => {
            try {
                localStorage.setItem('auth.access', access);
            } catch {}
            }),
        ),
        { dispatch: false },
    );

    clearTokens$ = createEffect(
        () =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
            try {
                localStorage.removeItem('auth.access');
                localStorage.removeItem('auth.refresh');
            } catch {}
            }),
        ),
        { dispatch: false },
    );
}
