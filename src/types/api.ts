export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    executionTimeMs?: number;
}

export interface LoginResponse {
    token: string;
    expiresAtUtc: string;
    role: string;
}

export interface Order {
    id: string;
    tableNumber: number;
    waiterId: string;
    waiterName: string;
    status: string;
    startedAt: string;
    completedAt: string;
    totalAmount: number;
    items: OrderItem[];
}

export interface OrderItem {

}