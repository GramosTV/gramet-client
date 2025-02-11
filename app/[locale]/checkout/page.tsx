'use client';
import OrderSummary from '@/app/components/Checkout/OrderSummary';
import PaymentDetails from '@/app/components/Checkout/PaymentDetails';
import ShippingInfo from '@/app/components/Checkout/ShippingInfo';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Cart } from '@/app/common/interfaces/cart.interface';
import { ShippingFormInputs } from '@/app/common/interfaces/shipping-form-inputs.interface';
import { PaymentMethod } from '@/app/common/enums/payment-method.enum';
import Loading from '@/app/components/Loading';
enum Step {
  OrderSummary = 'Order Summary',
  ShippingInformation = 'Shipping Information',
  PaymentDetails = 'Payment Details',
  Confirmation = 'Confirmation',
}

const page: React.FC = () => {
  const [cart, setCart, removeValue] = useLocalStorage<Cart>('cart', []);
  const [step, setStep] = useState(Step.OrderSummary);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>();
  useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/cart');
      const data = await response.json();
      console.log(data.itemData);
      setCart(data.itemData);
      return data;
    },
    retry: 1,
  });
  const mutation = useMutation({
    mutationFn: async (formData: ShippingFormInputs) => {
      const response = await fetchWithAuth(`/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    },
    onSuccess: (res) => {
      router.push(res.url);
    },
    onError: (error) => {
      toast.error('Failed to place order');
    },
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingFormInputs>();
  const router = useRouter();
  const submitOrder = async () => {
    if (shippingInfo) {
      mutation.mutate(shippingInfo);
    }
  };
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
        <div className="bg-base-100 p-8 flex rounded-lg min-h-[450px]">
          <ul className="steps steps-vertical">
            <li className={`step step-primary`}>Order Summary</li>
            <li
              className={`step ${
                step === Step.ShippingInformation || step === Step.PaymentDetails || step === Step.Confirmation
                  ? 'step-primary'
                  : ''
              }`}
            >
              Shipping Information
            </li>
            <li className={`step ${step === Step.PaymentDetails || step === Step.Confirmation ? 'step-primary' : ''}`}>
              Payment Details
            </li>
            <li className={`step ${step === Step.Confirmation ? 'step-primary' : ''}`}>Confirmation</li>
          </ul>
          {(() => {
            switch (step) {
              case Step.OrderSummary:
                return <OrderSummary products={cart} />;
              case Step.ShippingInformation:
                return <ShippingInfo setShippingInfo={setShippingInfo} />;
              case Step.PaymentDetails:
                return (
                  <PaymentDetails
                    submitOrder={submitOrder}
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                  />
                );
              case Step.Confirmation:
                return <Loading fixedHeight={false} />;
              default:
                return null;
            }
          })()}
        </div>
        {step !== Step.Confirmation && (
          <div className="mt-4 text-right">
            <button
              className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 px-12 ${
                (step === Step.ShippingInformation &&
                  (!shippingInfo ||
                    Object.entries(shippingInfo).some(([key, value]) => key !== 'apartmentNumber' && !value))) ||
                (step === Step.PaymentDetails && !selectedMethod)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => {
                if (step === Step.OrderSummary) setStep(Step.ShippingInformation);
                else if (step === Step.ShippingInformation) setStep(Step.PaymentDetails);
                else if (step === Step.PaymentDetails) {
                  setStep(Step.Confirmation);
                  submitOrder();
                }
              }}
              disabled={
                (step === Step.ShippingInformation &&
                  (!shippingInfo ||
                    Object.entries(shippingInfo).some(([key, value]) => key !== 'apartmentNumber' && !value))) ||
                (step === Step.PaymentDetails && !selectedMethod)
              }
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
