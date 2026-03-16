import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    imageUrls: Array<string>;
    name: string;
    createdAt: bigint;
    description: string;
    sizes: Array<string>;
    availability: boolean;
    category: string;
    price: bigint;
}
export interface OrderItem {
    size: string;
    productId: bigint;
    productName: string;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    total: bigint;
    paymentMethod: string;
    deliveryFee: bigint;
    customerPhone: string;
    createdAt: bigint;
    customerAddress: string;
    items: Array<OrderItem>;
    subtotal: bigint;
}
export interface backendInterface {
    addProduct(name: string, price: bigint, description: string, imageUrls: Array<string>, category: string, sizes: Array<string>, availability: boolean): Promise<bigint>;
    cancelOrder(orderId: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getContactInfo(): Promise<string>;
    getOrder(id: bigint): Promise<Order>;
    getOrders(password: string): Promise<Array<Order>>;
    getOrdersByPhone(phone: string): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getReturnPolicy(): Promise<string>;
    initialize(): Promise<void>;
    isInitializedQuery(): Promise<boolean>;
    placeOrder(customerName: string, customerPhone: string, customerAddress: string, items: Array<OrderItem>, paymentMethod: string): Promise<bigint>;
    updateOrderStatus(orderId: bigint, status: string, password: string): Promise<void>;
    updateProduct(id: bigint, name: string, price: bigint, description: string, imageUrls: Array<string>, category: string, sizes: Array<string>, availability: boolean): Promise<void>;
    verifyAdminPassword(password: string): Promise<boolean>;
}
