'use client';
import { fetchWithAuth } from '@/app/lib/auth-api';
import React from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Order } from '@/app/common/interfaces/order.interface';
import { DeliveryStatus } from '@/app/common/enums/delivery-status.enum';

const OrderPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isPending, isError } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/orders/findbyId/${id}`);
      const order = await response.json();
      return order;
    },
  });

  const dispatchOrderMutation = useMutation({
    mutationFn: async () => {
      await fetchWithAuth(`/api/orders/dispatch/${id}`, { method: 'PATCH' });
    },
    onSuccess: () => {
      toast.success('Order dispatched successfully');
      router.push('/admin-panel');
    },
    onError: () => {
      toast.error('Failed to dispatch order');
    },
  });

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
            {data.items.map((item, index) => (
              <li key={index} className="mb-4 text-gray-700">
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Product ID:</strong> {item.productId}
                </p>
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Product name:</strong> {item.product ? item.product.name : 'N/A'}
                </p>
                <p className="mb-1 text-gray-700">
                  <strong className="text-gray-700">Product color:</strong>{' '}
                  {item.product ? item.product.colors.find((color) => color._id === item.colorId)?.name : 'N/A'}
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
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            onClick={() => dispatchOrderMutation.mutate()}
          >
            Dispatch Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
