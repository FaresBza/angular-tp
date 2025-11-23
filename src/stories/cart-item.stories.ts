import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from './cart-item.component';

const meta: Meta<CartItemComponent> = {
    title: 'Shop/Cart/Cart Item',
    component: CartItemComponent,
    args: {
        name: 'Classeur Rouge',
        price: 4.5,
        quantity: 2,
    },
};

export default meta;
type Story = StoryObj<CartItemComponent>;

export const Default: Story = {};

