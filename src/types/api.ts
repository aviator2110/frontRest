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
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: string;
}

export interface PanelAccount {
    id: string;
    login: string;
    panelType: string;
    isActive: boolean;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    createdAt: string;
}

export interface Table {
    id: string;
    number: number;
    isActive: boolean;
}

export interface Waiter {
    id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
}