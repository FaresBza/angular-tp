import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    UserProfile,
    OrderSummary,
    OrderDetail,
    UserPreferences,
    Address,
} from './user.models';

export const UserActions = createActionGroup({
    source: 'User',
    events: {
        loadProfile: emptyProps(),
        loadProfileSuccess: props<{ profile: UserProfile }>(),
        loadProfileFailure: props<{ error: string }>(),

        updatePreferences: props<{ preferences: Partial<UserPreferences> }>(),
        updatePreferencesSuccess: props<{ profile: UserProfile }>(),
        updatePreferencesFailure: props<{ error: string }>(),

        loadOrders: emptyProps(),
        loadOrdersSuccess: props<{ orders: OrderSummary[] }>(),
        loadOrdersFailure: props<{ error: string }>(),

        loadOrderDetails: props<{ id: string }>(),
        loadOrderDetailsSuccess: props<{ order: OrderDetail }>(),
        loadOrderDetailsFailure: props<{ error: string }>(),

        createOrderFromCart: props<{ id: string; shippingAddress: Address }>(),
        createOrderFromCartSuccess: props<{ order: OrderDetail }>(),
        createOrderFromCartFailure: props<{ error: string }>(),

        initWishlist: emptyProps(),
        setWishlist: props<{ productIds: string[] }>(),
        toggleWishlistItem: props<{ productId: string }>(),
        toggleWishlistItemFailure: props<{ error: string }>(),
    },
});
