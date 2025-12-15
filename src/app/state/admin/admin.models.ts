export type AdminTopProduct = {
    productId: number;
    name: string;
    qty: number;
};

export type AdminSummary = {
    totalOrders: number;
    revenue: number;
    avgBasket: number;
    topProducts: AdminTopProduct[];
};

export type AdminRecentOrder = {
    id: string | number;
    createdAt: string;
    itemsCount: number;
    total: number;
    status: string;
};

export type AdminLowStockProduct = {
    id: number;
    name: string;
    stock: number;
    lowStockThreshold: number;
};

export interface AdminState {
    summary: AdminSummary | null;
    recentOrders: AdminRecentOrder[];
    lowStock: AdminLowStockProduct[];

    loading: boolean;
    error: string | null;
}
