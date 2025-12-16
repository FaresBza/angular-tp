import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { cartReducer } from './state/cart/cart.reducer';
import { userReducer } from './state/user/user.reducer';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { adminReducer } from './state/admin/admin.reducer';

import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';
import { UserEffects } from './state/user/user.effects';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { AdminEffects } from './state/admin/admin.effects';
import { CartEffects } from './state/cart/cart.effects';

import { uiReducer, UI_FEATURE_KEY } from './state/ui/ui.reducer';
import { UiEffects } from './state/ui/ui.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    importProvidersFrom(MatSnackBarModule),

    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      user: userReducer,
      reviews: reviewsReducer,
      admin: adminReducer,

      [UI_FEATURE_KEY]: uiReducer,
    }),

    provideEffects(
      [
        AuthEffects, 
        ProductsEffects, 
        UserEffects, 
        ReviewsEffects,
        AdminEffects,
        CartEffects,
        UiEffects,
      ]
    ),

    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
