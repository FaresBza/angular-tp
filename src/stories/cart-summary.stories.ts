import type { Meta, StoryObj } from '@storybook/angular';
import { CartSummaryComponent } from './cart-summary.component';

const meta: Meta<CartSummaryComponent> = {
  title: 'Shop/Cart/Cart Summary',
  component: CartSummaryComponent,
  args: {
    subtotal: 120,
    discount: 20,
    deliveryFee: 5,
    total: 105,
  },
};

export default meta;
type Story = StoryObj<CartSummaryComponent>;

export const Default: Story = {};
