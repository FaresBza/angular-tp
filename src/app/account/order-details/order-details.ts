import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, CurrencyPipe, NgIf, NgForOf, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  selectUserSelectedOrder,
  selectUserLoading,
  selectUserError,
} from '../../state/user/user.selectors';
import { UserActions } from '../../state/user/user.actions';
import { SideNavComponent } from "../../layout/side-nav/side-nav";

@Component({
  selector: 'app-account-order-details',
  standalone: true,
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    UpperCasePipe,
    SideNavComponent
],
})
export class OrderDetailsPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  loading$ = this.store.select(selectUserLoading);
  order$ = this.store.select(selectUserSelectedOrder);
  error$ = this.store.select(selectUserError);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(UserActions.loadOrderDetails({ id }));
    }
  }
}