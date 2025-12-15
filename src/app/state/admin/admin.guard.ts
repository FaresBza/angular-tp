import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuth } from '../auth/auth.selectors';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (_route, _state) => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectAuth).pipe(
        take(1),
        map((auth) => {
        const isAdmin = (auth as any)?.username === 'admin';
        if (isAdmin) return true;

        return router.createUrlTree(['/dashboard/admin']);
        }),
    );
};
