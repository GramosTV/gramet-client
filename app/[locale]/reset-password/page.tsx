'use client';
import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useResetPassword } from '@/app/lib/hooks/useAuth';

type ResetPasswordFormValues = {
  password: string;
  repeatPassword: string;
};

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>();

  const t = useTranslations('ResetPassword');
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get('token');

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      return;
    }
    resetPasswordMutation.mutate({
      ...data,
      token,
    });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)*2)]">
        <div className="flex-grow max-w-md p-6 mx-auto bg-gray-100 rounded-md shadow-md text-center">
          <h1 className="mb-4 text-xl font-bold text-red-600">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)*2)]">
      <div className="flex-grow max-w-md p-6 mx-auto bg-gray-100 rounded-md shadow-md">
        <h1 className="mb-4 text-xl font-bold">{t('reset-password')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('pass')}</label>
            <input
              {...register('password', {
                required: t('error-pass-required'),
                minLength: { value: 6, message: t('error-pass-length') },
                maxLength: { value: 20, message: t('error-pass-max-length') },
              })}
              type="password"
              placeholder={t('pass')}
              className={`w-full mt-1 p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              disabled={resetPasswordMutation.isPending}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('repeat-pass')}</label>
            <input
              {...register('repeatPassword', {
                required: t('error-repeat-pass-required'),
                validate: (value) => value === watch('password') || t('error-repeat-pass-match'),
              })}
              type="password"
              placeholder={t('repeat-pass')}
              className={`w-full mt-1 p-2 border ${
                errors.repeatPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              disabled={resetPasswordMutation.isPending}
            />
            {errors.repeatPassword && <p className="mt-1 text-sm text-red-500">{errors.repeatPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
              resetPasswordMutation.isPending ? 'btn-off' : ''
            }`}
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : t('reset-password')}
          </button>
        </form>
      </div>
    </div>
  );
};

const page = () => {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
};

export default page;
