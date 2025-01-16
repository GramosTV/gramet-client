'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchWithAuth } from '../../lib/auth-api';
import { useTranslations } from 'next-intl';
import { Bounce, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type ForgotPasswordFormValues = {
  email: string;
};

const Page: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setPending(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to send reset password email');
      }
      setPending(false);
      toast.success('Reset password email sent');
      router.push('/');
    } catch (error) {
      setPending(false);
      router.push('/');
    }
  };
  const t = useTranslations('ForgotPassword');
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)*2)]">
      <div className="flex-grow max-w-md p-6 mx-auto bg-gray-100 rounded-md shadow-md">
        <h1 className="mb-4 text-xl font-bold">{t('forgotPassword')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email', {
                required: t('error-email-required'),
                minLength: { value: 5, message: t('error-email-length') },
              })}
              type="email"
              placeholder="Email"
              className={`w-full mt-1 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className={'w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700' + (pending ? ' btn-off' : '')}
          >
            {t('sendResetLink')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
