export type UiToastType = 'success' | 'error' | 'info' | 'warning';

export interface UiToast {
    id: string;
    type: UiToastType;
    message: string;
    durationMs?: number;
}

export interface UiState {
    loading: {
        productsList: boolean;
        productDetails: boolean;
        checkout: boolean;
    };
    toasts: UiToast[];
}
