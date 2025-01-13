'use client';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
import { ShippingFormInputs } from './ShippingInfo';

interface PaymentDetailsProps {
  submitOrder: () => Promise<void>;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ submitOrder }) => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
  };
  const router = useRouter();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
      <div className="flex flex-col space-y-4">
        <button
          className={`btn ${selectedMethod === 'credit' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectMethod('credit')}
        >
          Credit Card
        </button>
        <button
          className={`btn ${selectedMethod === 'paypal' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectMethod('paypal')}
        >
          PayPal
        </button>
        <button
          className={`btn ${selectedMethod === 'bank' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectMethod('bank')}
        >
          Bank Transfer
        </button>
      </div>
      {selectedMethod && (
        <div className="mt-4">
          <p className="text-lg">
            You have selected: <span className="font-semibold">{selectedMethod}</span>
          </p>
        </div>
      )}
      <button onClick={submitOrder}>Submit</button>
    </div>
  );
};

export default PaymentDetails;
