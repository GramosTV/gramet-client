'use client';
import { Cart } from '@/app/common';
import OrderSummary from '@/app/components/Checkout/OrderSummary';
import PaymentDetails from '@/app/components/Checkout/PaymentDetails';
import ShippingInfo from '@/app/components/Checkout/ShippingInfo';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
enum Step {
  OrderSummary = 'Order Summary',
  ShippingInformation = 'Shipping Information',
  PaymentDetails = 'Payment Details',
  Confirmation = 'Confirmation',
}

const page = () => {
  const [cart, setCart, removeValue] = useLocalStorage<Cart>('cart', []);
  const [step, setStep] = useState(Step.OrderSummary);
  useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/cart');
      const data = await response.json();
      setCart(data.itemData);
      return data;
    },
    retry: 1,
  });
  const [shippingInfo, setShippingInfo] = useState({});
  const submitOrder = async () => {};
  return (
    <div className="mx-auto min-h-[calc(100vh-var(--header-height))] bg-gray-100 flex justify-center items-start">
      <div className="container max-w-[1100px] pt-8">
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
          {(() => {
            switch (step) {
              case Step.OrderSummary:
                return <OrderSummary />;
              case Step.ShippingInformation:
                return <ShippingInfo setShippingInfo={setShippingInfo} />;
              case Step.PaymentDetails:
                return <PaymentDetails submitOrder={submitOrder} />;
              case Step.Confirmation:
                return <></>;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default page;
