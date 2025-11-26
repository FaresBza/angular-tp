import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserProfile, OrderSummary, OrderDetail, UserPreferences } from './user.models';

export const UserActions = createActionGroup({
    source: 'User',
    events: {
        'loadProfile': emptyProps(),
        'loadProfileSuccess': props<{ profile: UserProfile }>(),
        'loadProfileFailure': props<{ error: string }>(),

        'updatePreferences': props<{ preferences: Partial<UserPreferences> }>(),
        'updatePreferencesSuccess': props<{ profile: UserProfile }>(),
        'updatePreferencesFailure': props<{ error: string }>(),

        'loadOrders': emptyProps(),
        'loadOrdersSuccess': props<{ orders: OrderSummary[] }>(),
        'loadOrdersFailure': props<{ error: string }>(),

        'loadOrderDetails': props<{ id: string }>(),
        'loadOrderDetailsSuccess': props<{ order: OrderDetail }>(),
        'loadOrderDetailsFailure': props<{ error: string }>(),
    },
});
