import { Component, Input } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'storybook-product-details',
    standalone: true,
    template: `
        <div class="rating-page">
        <mat-card class="rating-card">
            <div class="rating-content">
            <div class="rating-header">
                <div class="rating-header-main">
                <h1 class="product-title">{{ name }}</h1>

                <p class="rating-line">
                    <span class="rating-value">{{ productId }}</span>
                </p>
                </div>

                <p class="product-subtitle">
                Track customer satisfaction and see how this product is performing in real time.
                </p>
            </div>

            <div class="rating-stars-row">
                <div class="stars">
                <ng-container *ngFor="let star of [1,2,3,4,5]; let i = index">
                    <span
                    class="star"
                    [ngClass]="{ 'filled': i < Math.round(avgRating) }"
                    >
                    ★
                    </span>
                </ng-container>
                </div>

                <span class="rating-score">
                {{ avgRating.toFixed(1) }}/5
                </span>

                <span class="rating-count">
                {{ ratingCount }} customer reviews
                </span>
            </div>

            <div class="rating-info-panel">
                <ul class="rating-bullets">
                <li>
                    <span class="bullet-dot"></span>
                    Average rating based on real customer feedback.
                </li>
                <li>
                    <span class="bullet-dot"></span>
                    {{ ratingCount }} verified votes recorded.
                </li>
                <li>
                    <span class="bullet-dot"></span>
                    Updated each time a new rating is submitted.
                </li>
                </ul>
            </div>

            <div class="rating-footer">
                <div class="rating-actions">
                <button
                    mat-raised-button
                    class="primary-cta"
                >
                    ADD TO CART / {{ price }}.- CHF
                </button>
                </div>
            </div>
            </div>
        </mat-card>
    </div>
    `,
    styleUrls: ['./product-details.css'],
    imports: [
        NgFor,
        NgClass,
        MatCardModule,
        MatButtonModule
    ]
})
export class ProductDetailsComponent {
    @Input() name!: string;
    @Input() price!: number;
    @Input() avgRating!: number;
    @Input() ratingCount!: number;
    @Input() productId!: number;
    
    public Math = Math;
}
