import React from 'react';

const OrderSummary = () => {
  const products = [
    { name: 'Product 1', price: '$20.00' },
    { name: 'Product 2', price: '$30.00' },
  ];

  return (
    <div className="p-4 bg-white shadow-sm rounded-md w-full max-w-xl mx-auto flex">
      <div className="w-1/2 pr-4">
        <h3 className="text-lg font-semibold mb-4">Products</h3>
        <ul>
          {products.map((product, idx) => (
            <li key={idx} className="flex justify-between mb-2">
              <span>{product.name}</span>
              <span>{product.price}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Item Subtotal</span>
          <span>$50.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$4.50</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>$59.50</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
