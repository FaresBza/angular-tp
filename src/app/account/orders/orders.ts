import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, CurrencyPipe, NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  selectUserOrders,
  selectUserLoading,
  selectUserError,
} from '../../state/user/user.selectors';
import { UserActions } from '../../state/user/user.actions';

@Component({
  selector: 'app-account-orders',
  standalone: true,
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    UpperCasePipe
  ],
})
export class OrdersPageComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  loading$ = this.store.select(selectUserLoading);
  orders$ = this.store.select(selectUserOrders);
  error$ = this.store.select(selectUserError);

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadOrders());
  }

  orderStatusIcon(status: string): string {
    switch (status) {
      case 'shipped':
        return 'local_shipping';
      case 'delivered':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'hourglass_empty';
    }
  }

  openOrder(id: string) {
    this.router.navigate(['/account/orders', id]);
  }
}