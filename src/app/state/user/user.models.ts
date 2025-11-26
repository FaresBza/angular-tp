export interface Address {
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country: string;
}

export interface OrderItem {
    productId: number;
    name: string;
    unitPrice: number;
    quantity: number;
    total: number;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderSummary {
    id: string;
    createdAt: string;
    status: OrderStatus;
    total: number;
    currency: string;
}

export interface OrderDetail extends OrderSummary {
    items: OrderItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    taxes: number;
    grandTotal: number;
    shippingAddress: Address;
}

export interface UserPreferences {
    newsletter: boolean;
    defaultMinRating?: number;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    defaultAddress?: Address;
    preferences: UserPreferences;
    orders: OrderSummary[];
}
