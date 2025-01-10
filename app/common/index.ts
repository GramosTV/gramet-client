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
