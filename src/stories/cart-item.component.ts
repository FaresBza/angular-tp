import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-cart-item',
  standalone: true,
  template: `
    <article class="cart-item-card">
      <div class="cart-item-left">
        <div class="cart-item-thumb">
          <span class="cart-item-thumb-placeholder">
            {{ name[0] }}
          </span>
        </div>

        <div class="cart-item-info">
          <h3 class="cart-item-name">{{ name }}</h3>
          <p class="cart-item-meta">Qty: {{ quantity }}</p>
        </div>
      </div>

      <div class="cart-item-right">
        <div class="cart-item-price">
          {{ price }} €
        </div>

        <div class="cart-item-qty-control">
          <button type="button" class="qty-btn">−</button>
          <span class="qty-value">{{ quantity }}</span>
          <button type="button" class="qty-btn">+</button>
        </div>

        <button type="button" class="cart-item-remove">
          X
        </button>
      </div>
    </article>
  `,
  styleUrls: ['./cart-item.css'],
})
export class CartItemComponent {
  @Input() name!: string;
  @Input() price!: number;
  @Input() quantity!: number;
}
