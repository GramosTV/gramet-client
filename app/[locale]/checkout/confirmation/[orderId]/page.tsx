'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/app/common/interfaces/order.interface';
import { useOrder } from '@/app/lib/hooks/useOrders';
enum Step {
  OrderSummary = 'Order Summary',
  ShippingInformation = 'Shipping Information',
  PaymentDetails = 'Payment Details',
  Confirmation = 'Confirmation',
}

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams();
  const [step, setStep] = useState(Step.Confirmation);
  const router = useRouter();

  // Use React Query hook
  const { data, error, isPending: isLoading } = useOrder(orderId as string);
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

export default OrderConfirmationPage;
