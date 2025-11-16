import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { AuthActions } from './auth.actions';
import { catchError, map, switchMap, of } from 'rxjs';

interface LoginRes { access: string; refresh: string }
interface RefreshRes { access: string }

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

    login$ = createEffect(() =>
        this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ username, password }) =>
            this.http.post<LoginRes>('/api/auth/token/', { username, password }).pipe(
            map(({ access, refresh }) => AuthActions.loginSuccess({ access, refresh })),
            catchError((err) =>
                of(AuthActions.loginFailure({ error: err?.message ?? 'Login failed' }))
            )
            )
        )
        )
    );

    refresh$ = createEffect(() =>
        this.actions$.pipe(
        ofType(AuthActions.refreshToken),
        switchMap(() =>
            this.http.post<RefreshRes>('/api/auth/token/refresh/', {}).pipe(
            map(({ access }) => AuthActions.refreshSuccess({ access })),
            catchError(() =>
                of(AuthActions.loginFailure({ error: 'Refresh failed' }))
            )
            )
        )
        )
    );
}
