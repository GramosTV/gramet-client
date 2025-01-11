export interface Color {
  name: string;
  hex: string;
  stock: number;
}

export interface Product {
  name: string;
  brand: string;
  code: string;
  colors: Color[];
  materials: string[];
  price: number;
  images: string[];
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
  productId: string;

  color: Color;

  quantity: number;
}

export interface Cart {
  userId: string;

  items: CartItem[];
}
