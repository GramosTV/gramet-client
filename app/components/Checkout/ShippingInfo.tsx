'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
export interface ShippingFormInputs {
  fullName: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  city: string;
  zipCode: string;
}

interface ShippingFormProps {
  setShippingInfo: Dispatch<SetStateAction<ShippingFormInputs | undefined>>;
}

export const ShippingForm = ({ setShippingInfo }: ShippingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>();

  const onSubmit: SubmitHandler<ShippingFormInputs> = (data) => {
    setShippingInfo(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded space-y-4 mx-auto">
      <h2 className="text-xl font-bold">Shipping Address</h2>
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input {...register('fullName', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Street Name</label>
          <input {...register('street', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
          {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">House Number</label>
          <input {...register('houseNumber', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
          {errors.houseNumber && <p className="text-red-500 text-sm">{errors.houseNumber.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Apartment Number (Optional)</label>
          <input {...register('apartmentNumber')} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">City</label>
          <input {...register('city', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Zip</label>
          <input {...register('zipCode', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
        </div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
    </form>
  );
};

export default ShippingForm;
