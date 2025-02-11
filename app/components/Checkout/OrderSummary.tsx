import { CartItem } from '@/app/common/interfaces/cart.interface';
import React from 'react';

const OrderSummary = ({ products }: { products: CartItem[] }) => {
  const itemSubtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const shipping = 11.0;
  const total = itemSubtotal + shipping;

  return (
    <div className="p-4 bg-white rounded-md w-full max-w-3xl mx-auto flex gap-8">
      <div className="w-1/2 pr-4">
        <h3 className="text-lg font-semibold mb-4">Products</h3>
        <ul>
          {products.map((product, i) => (
            <li key={i} className="flex justify-between mb-2">
              <span>
                {product.name} (x{product.quantity})
              </span>
              <span>{(product.price * product.quantity).toFixed(2)} zł</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Item Subtotal</span>
          <span>{itemSubtotal.toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{shipping.toFixed(2)} zł</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{total.toFixed(2)} zł</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
