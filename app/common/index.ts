export interface Color {
  _id?: string;
  name: string;
  hex: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  code: string;
  colors: Color[];
  materials: string[];
  price: number;
  category: Category;
  images: string[];
  url: string;
}

export enum Roles {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export interface JwtAccessPayload {
  email: string;
  sub: string;
  role: Roles;
}

export interface JwtRefreshPayload {
  email: string;
  sub: string;
  jti: string;
  role: Roles;
}

export enum Category {
  FURNITURE_HANDLES = 'Furniture handles',
  FURNITURE_KNOBS = 'Furniture knobs',
  FURNITURE_HOOKS = 'Furniture hooks',
  FURNITURE_FEET = 'Furniture feet',
  FURNITURE_LIGHTING = 'Furniture lighting',
  TECHNICAL_ACCESSORIES = 'Technical accessories',
  METAL_DECORATIONS = 'Metal decorations',
  CARGO_BASKETS = 'Cargo baskets',
  DRAWERS = 'Drawers',
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  productId: string;
  colors: Color[];
  quantity: number;
}

export type Cart = CartItem[];

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum DeliveryStatus {
  NOT_DISPATCHED = 'not_dispatched',
  DISPATCHED = 'dispatched',
  DELIVERED = 'delivered',
}

export interface Order {
  userId: string;
  transactionId: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  fullName: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  city: string;
  zipCode: string;
  items: CartItem[];
  createdAt: Date;
}
