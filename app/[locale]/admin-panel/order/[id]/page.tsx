'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Order } from '@/app/common/interfaces/order.interface';
import { DeliveryStatus } from '@/app/common/enums/delivery-status.enum';
import { useOrder, useDispatchOrder } from '@/app/lib/hooks/useOrders';

const OrderPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  // Use React Query hooks
  const { data, isPending, isError } = useOrder(id as string);
  const dispatchOrderMutation = useDispatchOrder();

  if (isPending) {
    return <div className="py-10 text-center text-sky-600">Fetching order...</div>;
  }
  if (isError) {
    return <div className="py-10 text-center text-red-600">Error fetching order</div>;
  }

  return (
    <div className="flex p-6 bg-white shadow-md rounded-lg max-h-[calc(100vh-var(--header-height))] overflow-y-auto grow pl-16">
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="cursor-pointer text-gray-700 text-2xl my-1"
        onClick={() => router.push('/admin-panel')}
      />
      <div className="mx-2">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Order #{data._id}</h1>
        <div className="mb-6">
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">User ID:</strong> {data.userId}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Transaction ID:</strong> {data.transactionId}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Payment Status:</strong> {data.paymentStatus}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Delivery Status:</strong> {data.deliveryStatus}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Full Name:</strong> {data.fullName}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Street:</strong> {data.street}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">House Number:</strong> {data.houseNumber}
          </p>
          {data.apartmentNumber && (
            <p className="mb-2 text-gray-700">
              <strong className="text-gray-700">Apartment Number:</strong> {data.apartmentNumber}
            </p>
          )}
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">City:</strong> {data.city}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Zip Code:</strong> {data.zipCode}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="text-gray-700">Ordered At:</strong> {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Items</h2>
          <ul className="list-inside list-none">
            {data.items.map((item: any, index: number) => (
              <li key={index} className="mb-4 text-gray-700">
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Product ID:</strong> {item.productId}
                </p>
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Product name:</strong> {item.product ? item.product.name : 'N/A'}
                </p>
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Product color:</strong>{' '}
                  {item.product ? item.product.colors.find((color: any) => color._id === item.colorId)?.name : 'N/A'}
                </p>
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Quantity:</strong> {item.quantity}
                </p>
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Price:</strong> $
                  {item.priceAtTimeOfOrder ? item.priceAtTimeOfOrder * item.quantity : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {data.deliveryStatus === DeliveryStatus.NOT_DISPATCHED && (
          <button
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => dispatchOrderMutation.mutate(id as string)}
            disabled={dispatchOrderMutation.isPending}
          >
            {dispatchOrderMutation.isPending ? 'Dispatching...' : 'Dispatch Order'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
