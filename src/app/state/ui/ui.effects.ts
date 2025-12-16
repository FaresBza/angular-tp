import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, withLatestFrom, tap } from 'rxjs';
import { UiActions } from './ui.actions';
import { selectNextToast } from './ui.selectors';

@Injectable()
export class UiEffects {
    private actions$ = inject(Actions);
    private store = inject(Store);
    private snackBar = inject(MatSnackBar);

    showToast$ = createEffect(
        () =>
        this.actions$.pipe(
            ofType(
            UiActions.notify,
            UiActions.notifySuccess,
            UiActions.notifyError,
            UiActions.notifyInfo,
            UiActions.notifyWarning,
            ),
            withLatestFrom(this.store.select(selectNextToast)),
            filter(([, toast]) => !!toast),
            tap(([, toast]) => {
            const duration = toast!.durationMs ?? (toast!.type === 'error' ? 5000 : 3000);
            this.snackBar.open(toast!.message, 'OK', {
                duration,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: [`toast-${toast!.type}`],
            });

            this.store.dispatch(UiActions.toastShown({ id: toast!.id }));
            }),
        ),
        { dispatch: false },
    );
}
