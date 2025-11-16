import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

import { ProductsActions } from '../state/products/products.action';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { selectProductsList } from '../state/products/products.selectors';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  imports: [
    AsyncPipe,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
})
export class Products implements OnInit {
  private store = inject(Store);

  displayedColumns = ['id', 'name', 'price', 'created_at', 'avg'];

  products$ = this.store.select(selectProductsList);

  ngOnInit(): void {
    this.store.dispatch(
      ProductsActions.loadProducts({
        page: 1,
        pageSize: 20,
        minRating: 0,
        ordering: '-created_at',
      })
    );
  }
}
