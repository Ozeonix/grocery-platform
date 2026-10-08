// ============================================================================
// @grocery/shared-types
// Authoritative Domain and API Type Definitions
// ============================================================================

export type UserRole =
  | 'ROLE_CUSTOMER'
  | 'ROLE_STORE_OWNER'
  | 'ROLE_STORE_STAFF'
  | 'ROLE_DELIVERY_PARTNER'
  | 'ROLE_ADMIN'
  | 'ROLE_OPS';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  active: boolean;
  verified: boolean;
  roles: UserRole[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  defaultAddress: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp: string;
}

export type StoreStatus = 'ONBOARDING' | 'ACTIVE' | 'PAUSED' | 'SUSPENDED';

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  bannerUrl?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  status: StoreStatus;
  isAcceptingOrders: boolean;
  openingTime: string;
  closingTime: string;
}

export interface Category {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  unit: string;
  imageUrl?: string;
  status: string;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  storeId?: string;
  items: CartItem[];
  subtotal: number;
}

export type OrderStatus =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  deliveryAddress?: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  placedAt: string;
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  items: OrderItem[];
}
