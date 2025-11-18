import { Component, Input } from '@angular/core';
import { NgIf, DatePipe, CurrencyPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    MatCardModule, 
    MatTableModule
  ],
  template: `
    <div class="rating-page">
  <mat-card class="rating-card">
    <div class="rating-header">
      <h2>Product Rating</h2>
      <span class="rating-id">ID : {{ id }}</span>
    </div>

    <div class="rating-result">
      <p class="rating-line">
        Average rating:
        <strong>{{ avgRating }}</strong>/5
      </p>
      <p class="rating-line">
        Votes: <strong>{{ count }}</strong>
      </p>
    </div>

    <div class="rating-actions">
      <button mat-stroked-button>
        ← Back to products
      </button>
    </div>
  </mat-card>
</div>
  `,
  styleUrls: ['./product-rating.css'],
})
export class ProductCardComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() price!: number;
  @Input() created_at!: string;
  @Input() avgRating?: number | null;
  @Input() count!: number;
}
