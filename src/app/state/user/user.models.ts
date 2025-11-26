export interface Address {
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country: string;
}

export interface OrderSummary {
    id: string;
    createdAt: string;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    currency: string;
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
