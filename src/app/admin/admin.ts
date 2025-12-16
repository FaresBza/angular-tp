import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { AdminActions } from '../state/admin/admin.actions';
import {
  selectAdminError,
  selectAdminLoading,
  selectAdminLowStock,
  selectAdminRecentOrders,
  selectAdminSummary,
} from '../state/admin/admin.selectors';

import { SideNavComponent } from '../layout/side-nav/side-nav';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SideNavComponent,
    NgIf,
    NgFor,
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    NgClass,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
})
export class AdminPageComponent implements OnInit {
  private store = inject(Store);

  loading$ = this.store.select(selectAdminLoading);
  error$ = this.store.select(selectAdminError);

  summary$ = this.store.select(selectAdminSummary);
  recentOrders$ = this.store.select(selectAdminRecentOrders);
  lowStock$ = this.store.select(selectAdminLowStock);

  displayedOrdersColumns = ['id', 'createdAt', 'itemsCount', 'total', 'status'];
  displayedLowStockColumns = ['name', 'stock', 'threshold'];

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadDashboard({ limit: 10 }));
  }

  stockLabel(stock: number, threshold: number) {
    if (stock === 0) return 'Rupture de stock';
    if (stock <= threshold) return `Plus que ${stock} en stock`;
    return 'En stock';
  }

  stockClass(stock: number, threshold: number) {
    if (stock === 0) return 'stock-out';
    if (stock <= threshold) return 'stock-low';
    return 'stock-ok';
  }
}