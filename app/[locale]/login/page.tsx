'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchWithAuth, setAccessToken } from '../../lib/auth-api';
import { useTranslations } from 'next-intl';
import { Bounce, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';

type LoginFormValues = {
  email: string;
  password: string;
};
const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const [pending, setPending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const router = useRouter();
  const onSubmit = async (data: LoginFormValues) => {
    setPending(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please validate your email');
          setPending(false);
          return;
        }
        throw new Error('Failed to login');
      }
      const result = await response.json();
      setAccessToken(result.accessToken);
      setPending(false);
      toast.success(t('success'));
      setIsLoggedIn(true);
      router.push('/');
    } catch (error) {
      setPending(false);
      toast.error(t('fail'));
    }
  };
  const t = useTranslations('Login');
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)*2)]">
      <div className="flex-grow max-w-md p-6 mx-auto bg-gray-100 rounded-md shadow-md">
        <h1 className="mb-4 text-xl font-bold">{t('login')}</h1>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('pass')}</label>
            <input
              {...register('password', {
                required: t('error-pass-required'),
                minLength: { value: 6, message: t('error-pass-length') },
              })}
              type="password"
              placeholder={t('pass')}
              className={`w-full mt-1 p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className={'w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700' + (pending ? ' btn-off' : '')}
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
