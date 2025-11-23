import type { Meta, StoryObj } from '@storybook/angular';
import { ProductDetailsComponent } from './product-details.component';

const meta: Meta<ProductDetailsComponent> = {
  title: 'Shop/Product Details',
  component: ProductDetailsComponent,
  args: {
    name: 'Handmade Jute Basket',
    price: 18,
    avgRating: 4.3,
    ratingCount: 32,
    productId: 12,
  },
};

export default meta;
type Story = StoryObj<ProductDetailsComponent>;

export const Default: Story = {};

export const ExcellentRating: Story = {
  args: {
    name: 'Feutres Couleur (Pack x10)',
    price: 7.9,
    avgRating: 4.9,
    ratingCount: 120,
    productId: 3,
  },
};

export const LowRating: Story = {
  args: {
    name: 'Palette Aquarelle',
    price: 9.5,
    avgRating: 2.1,
    ratingCount: 8,
    productId: 44,
  },
};
