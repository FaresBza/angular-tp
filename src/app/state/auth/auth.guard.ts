// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from './auth.selectors';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectIsLoggedIn).pipe(
        take(1),
        map((loggedIn) => {
            if (loggedIn) {
                return true;
            }
            return router.createUrlTree(['/login']);
        }),
    );
};
