import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../state/cart/cart.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  ],
})
export class CheckoutComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  items$ = this.store.select(selectCartItems);
  total$ = this.store.select(selectCartTotal);
  count$ = this.store.select(selectCartCount);

  cartForm = this.fb.group({
    ok: [true],
  });
}
