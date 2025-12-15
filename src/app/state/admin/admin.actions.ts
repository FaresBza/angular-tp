import { createActionGroup, props } from '@ngrx/store';
import { AdminLowStockProduct, AdminRecentOrder, AdminSummary } from './admin.models';

export const AdminActions = createActionGroup({
    source: 'Admin',
    events: {
        loadDashboard: props<{ limit?: number }>(),

        loadSummarySuccess: props<{ summary: AdminSummary }>(),
        loadRecentOrdersSuccess: props<{ orders: AdminRecentOrder[] }>(),
        loadLowStockSuccess: props<{ products: AdminLowStockProduct[] }>(),

        loadDashboardFailure: props<{ error: string }>(),
    },
});
