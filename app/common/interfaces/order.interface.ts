import { DeliveryStatus } from '../enums/delivery-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { CartItemForOrder } from './cart.interface';

export interface Order {
  _id: string;
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
  items: CartItemForOrder[];
  createdAt: Date;
}
