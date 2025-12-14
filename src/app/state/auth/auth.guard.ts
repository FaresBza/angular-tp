import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn, selectRefreshToken } from './auth.selectors';
import { AuthActions } from './auth.actions';
import { combineLatest, filter, map, of, switchMap, take, timeout, catchError } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    store.dispatch(AuthActions.hydrateFromStorage());

    return combineLatest([
        store.select(selectIsLoggedIn),
        store.select(selectRefreshToken),
    ]).pipe(
        take(1),
        switchMap(([loggedIn, refresh]) => {
        if (loggedIn) return of(true);

        if (refresh) {
            store.dispatch(AuthActions.refreshToken());

            return store.select(selectIsLoggedIn).pipe(
            filter(Boolean),
            take(1),
            timeout(2500),
            map(() => true),
            catchError(() =>
                of(
                router.createUrlTree(['/login'], {
                    queryParams: { returnUrl: state.url },
                }),
                ),
            ),
            );
        }

        return of(
            router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
            }),
        );
        }),
    );
};
