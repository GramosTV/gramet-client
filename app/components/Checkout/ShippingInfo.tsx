'use client';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
interface ShippingFormInputs {
  fullName: string;
  streetName: string;
  houseNumber: string;
  apartmentNumber?: string;
  city: string;
  zip: string;
}

interface ShippingFormProps {
  setShippingInfo: (data: ShippingFormInputs) => void;
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
          <input {...register('streetName', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
          {errors.streetName && <p className="text-red-500 text-sm">{errors.streetName.message}</p>}
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
          <input {...register('zip', { required: 'Required' })} className="w-full border rounded px-3 py-2" />
          {errors.zip && <p className="text-red-500 text-sm">{errors.zip.message}</p>}
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Confirm
      </button>
    </form>
  );
};

export default ShippingForm;
