import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';

import { LoginPageComponent } from './login/login';
import { ProductsPageComponent } from './products/products';
import { ProductDetailsPageComponent } from './product-details/product-details';
import { CartPageComponent } from './cart/cart';
import { CheckoutComponent } from './checkout/checkout';
import { ProfilePageComponent } from './account/profile/profile';
import { OrdersPageComponent } from './account/orders/orders';
import { OrderDetailsPageComponent } from './account/order-details/order-details';
import { WishlistPageComponent } from './wishlist/wishlist';
import { authGuard } from './state/auth/auth.guard';
import { AdminPageComponent } from './admin/admin';
import { adminGuard } from './state/admin/admin.guard';
import { checkoutGuard } from './state/cart/checkout.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'app', component: AppPlaceholderComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'shop/products', component: ProductsPageComponent },
  { path: 'shop/details/:id', component: ProductDetailsPageComponent },
  { path: 'shop/cart', component: CartPageComponent },
  { path: 'shop/checkout', component: CheckoutComponent, canActivate: [checkoutGuard] },
  { path: 'shop/wishlist', component: WishlistPageComponent },
  { path: 'account/profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'account/orders', component: OrdersPageComponent, canActivate: [authGuard] },
  { path: 'account/orders/:id', component: OrderDetailsPageComponent, canActivate: [authGuard] },
  { path: 'dashboard/admin', component: AdminPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
  
];
