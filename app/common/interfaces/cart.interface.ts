import { Color } from './color.interface';
import { Product } from './product.interface';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  productId: string;
  colors: Color[];
  quantity: number;
}

export interface CartItemForOrder extends CartItem {
  priceAtTimeOfOrder: number;
  product: Product;
  colorId: string;
}

export type Cart = CartItem[];
