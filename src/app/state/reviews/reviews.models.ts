export interface Review {
    id: string;
    productId: string;
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewsState {
    byProductId: Record<string, Review[]>;
    loading: boolean;
    error: string | null;
}
