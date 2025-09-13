'use client';
import Loading from '@/app/components/Loading';
import NotFound from '@/app/components/NotFound';
import React from 'react';
import Image from 'next/image';
import { Order } from '@/app/common/interfaces/order.interface';
import { CartItemForOrder } from '@/app/common/interfaces/cart.interface';
import { useUserOrders } from '@/app/lib/hooks/useOrders';

const OrdersPage = () => {
  // Use React Query hook
  const { data, error, isLoading } = useUserOrders();

  if (isLoading) return <Loading />;
  if (error) return <NotFound />;

  return (
    <div>
      <h1>Orders</h1>
      {data?.map((order: Order) => (
        <div key={order.transactionId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p>
            <strong>Address:</strong> {order.street} {order.houseNumber},{' '}
            {order.apartmentNumber ? `${order.apartmentNumber}, ` : ''}
            {order.city}, {order.zipCode}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Delivery Status:</strong> {order.deliveryStatus}
          </p>
          <h3>Items</h3>
          <ul>
            {order.items.map((item: CartItemForOrder, index: number) => (
              <li key={index}>
                <p>
                  <strong>Product:</strong>{' '}
                  <Image
                    width={40}
                    height={40}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/products/image/${item.productId}`}
                    alt={`Product ${item.productId}`}
                  />
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
