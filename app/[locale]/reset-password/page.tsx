'use client';
import React, { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

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
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const t = useTranslations('ResetPassword');
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const onSubmit = async (data: ResetPasswordFormValues) => {
    setPending(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, token }),
      });
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      setPending(false);
      toast.success(t('success'));
      router.push('/login');
    } catch (error) {
      setPending(false);
      toast.error(t('fail'));
    }
  };

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
            />
            {errors.repeatPassword && <p className="mt-1 text-sm text-red-500">{errors.repeatPassword.message}</p>}
          </div>
          <button
            type="submit"
            className={'w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700' + (pending ? ' btn-off' : '')}
          >
            {t('reset-password')}
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
