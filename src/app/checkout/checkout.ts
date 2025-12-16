import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../state/cart/cart.selectors';

import { UserActions } from '../state/user/user.actions';
import { Address } from '../state/user/user.models';
import { selectCheckoutLoading } from '../state/ui/ui.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SideNavComponent } from '../layout/side-nav/side-nav';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    SideNavComponent,
  ],
})
export class CheckoutComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  items$ = this.store.select(selectCartItems);
  total$ = this.store.select(selectCartTotal);
  count$ = this.store.select(selectCartCount);

  checkoutLoading$ = this.store.select(selectCheckoutLoading);

  addressForm = this.fb.group({
    fullName: ['', Validators.required],
    addressLine: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  lastOrderId: string | null = null;

  placeOrder() {
    if (this.addressForm.invalid) return;

    this.lastOrderId = null;

    const formValue = this.addressForm.value;

    const shippingAddress: Address = {
      line1: formValue.addressLine ?? '',
      city: formValue.city ?? '',
      zip: formValue.postalCode ?? '',
      country: formValue.country ?? '',
    };

    const id = 'ORD-' + Date.now();
    this.lastOrderId = id;

    this.store.dispatch(
      UserActions.createOrderFromCart({
        id,
        shippingAddress,
      }),
    );
  }
}
