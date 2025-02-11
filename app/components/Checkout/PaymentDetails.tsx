'use client';
import { PaymentMethod } from '@/app/common/enums/payment-method.enum';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

interface PaymentDetailsProps {
  selectedMethod: PaymentMethod | undefined;
  setSelectedMethod: React.Dispatch<React.SetStateAction<PaymentMethod | undefined>>;
  submitOrder: () => Promise<void>;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ selectedMethod, setSelectedMethod, submitOrder }) => {
  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  return (
    <div className="p-4 ml-8">
      <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
      <div className="flex flex-col space-y-4">
        <button
          className={`btn ${selectedMethod === PaymentMethod.CREDIT_CARD ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectMethod(PaymentMethod.CREDIT_CARD)}
        >
          Credit Card
        </button>
        <button
          className={`btn ${selectedMethod === PaymentMethod.BLIK ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectMethod(PaymentMethod.BLIK)}
        >
          Blik
        </button>
      </div>
      {/* {selectedMethod && (
        <div className="mt-4">
          <p className="text-lg">
            You have selected: <span className="font-semibold">{selectedMethod}</span>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default PaymentDetails;
