import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { UiToast } from './ui.models';

export const UiActions = createActionGroup({
    source: 'UI',
    events: {
        'Set Loading': props<{
        key: 'productsList' | 'productDetails' | 'checkout';
        isLoading: boolean;
        }>(),

        'Notify': props<{ toast: UiToast }>(),
        'Notify Success': props<{ message: string; durationMs?: number }>(),
        'Notify Error': props<{ message: string; durationMs?: number }>(),
        'Notify Info': props<{ message: string; durationMs?: number }>(),
        'Notify Warning': props<{ message: string; durationMs?: number }>(),

        'Toast Shown': props<{ id: string }>(),
        'Clear Toasts': emptyProps(),
    },
});
