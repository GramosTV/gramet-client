'use client';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/app/common/interfaces/order.interface';
enum Step {
  OrderSummary = 'Order Summary',
  ShippingInformation = 'Shipping Information',
  PaymentDetails = 'Payment Details',
  Confirmation = 'Confirmation',
}

const page: React.FC = () => {
  const { orderId } = useParams();
  const [step, setStep] = useState(Step.Confirmation);
  const { data, error, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/orders/findById/${orderId}`);
      return await response.json();
    },
    retry: 1,
  });
  const router = useRouter();
  return (
    <div className="mx-auto min-h-[calc(100vh-var(--header-height))] bg-gray-100 flex justify-center items-start">
      <div className="container max-w-[1200px] pt-8">
        <div className="breadcrumbs text-sm mb-3">
          <ul>
            <li>
              <Link href="/store" className="text-xl font-[700]">
                Store
              </Link>
            </li>
            <li className="text-xl">Checkout</li>
          </ul>
        </div>
        <div className="bg-base-100 p-8 flex rounded-lg">
          <ul className="steps steps-vertical">
            <li className={`step step-primary`}>Order Summary</li>
            <li
              onClick={() => setStep(Step.ShippingInformation)}
              className={`step ${
                step === Step.ShippingInformation || step === Step.PaymentDetails || step === Step.Confirmation
                  ? 'step-primary'
                  : ''
              }`}
            >
              Shipping Information
            </li>
            <li
              onClick={() => setStep(Step.PaymentDetails)}
              className={`step ${step === Step.PaymentDetails || step === Step.Confirmation ? 'step-primary' : ''}`}
            >
              Payment Details
            </li>
            <li
              onClick={() => setStep(Step.Confirmation)}
              className={`step ${step === Step.Confirmation ? 'step-primary' : ''}`}
            >
              Confirmation
            </li>
          </ul>
          <div className="p-4 bg-white shadow-sm rounded-md w-full max-w-xl mx-auto flex">
            {isLoading ? <p>Loading...</p> : error ? <p>Error loading order details</p> : <p>{JSON.stringify(data)}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
