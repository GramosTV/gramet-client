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
