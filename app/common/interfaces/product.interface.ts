import { Category } from '../enums/category.enum';
import { Color } from './color.interface';

export interface Product {
  _id: string;
  name: string;
  enName: string;
  brand: string;
  code: string;
  colors: Color[];
  materials: string[];
  price: number;
  category: Category;
  images: string[];
  url: string;
  obj: string;
}
