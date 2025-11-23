import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-cart-summary',
  standalone: true,
  template: `
    <aside class="cart-summary-panel">
        <h3 class="summary-title">Order Summary</h3>

        <div class="summary-rows">
            <div class="summary-row">
                <span>Subtotal</span>
                <span class="summary-value">{{ subtotal }} €</span>
            </div>

            <div class="summary-row summary-row-discount">
                <span>Discount</span>
                <span class="summary-value summary-value-discount">
                    -{{ discount }} €
                </span>
            </div>

            <div class="summary-row">
                <span>Delivery Fee</span>
                <span class="summary-value">{{ deliveryFee }} €</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row summary-row-total">
                <span>Total</span>
                <span class="summary-value summary-value-total">
                    {{ total }} €
                </span>
            </div>
        </div>

        <div class="summary-promo">
            <input
                type="text"
                class="promo-input"
                placeholder="Add promo code"
            />
            <button type="button" class="promo-apply-btn">
                Apply
            </button>
        </div>

        <button type="button" class="summary-checkout-btn">
            Go to Checkout →
        </button>
    </aside>
    `,
    styleUrls: ['./cart-summary.css'],
})
export class CartSummaryComponent {
    @Input() subtotal!: number;
    @Input() discount!: number;
    @Input() deliveryFee!: number;
    @Input() total!: number;
}
