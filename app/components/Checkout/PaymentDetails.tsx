'use client';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

interface PaymentDetailsProps {
  submitOrder: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ submitOrder }) => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
  };
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetchWithAuth(`/api/orders`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    },
    onSuccess: (res) => {
      router.push(res.url);
      //   toast.success('Product updated successfully');
      //   router.push('/admin-panel/products/view');
    },
    onError: (error: any) => {
      //   toast.error(error?.message || 'Failed to update product');
    },
  });
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
      <button onClick={submitOrder}></button>
    </div>
  );
};

export default PaymentDetails;
