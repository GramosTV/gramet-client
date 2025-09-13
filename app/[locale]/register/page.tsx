'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRegister } from '@/app/lib/hooks/useAuth';

type RegisterFormValues = {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  phoneNumber?: string;
};

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const t = useTranslations('Register');
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height)*2)]">
      <div className="flex-grow max-w-md p-6 mx-auto bg-gray-100 rounded-md shadow-md">
        <h1 className="mb-4 text-xl font-bold">{t('register')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              {...register('name', {
                required: t('error-name-required'),
                minLength: { value: 2, message: t('error-name-length') },
              })}
              type="text"
              placeholder={t('name')}
              className={`w-full mt-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              disabled={registerMutation.isPending}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('surname')}</label>
            <input
              {...register('surname', {
                required: t('error-surname-required'),
                minLength: { value: 2, message: t('error-surname-length') },
              })}
              type="text"
              placeholder={t('surname')}
              className={`w-full mt-1 p-2 border ${errors.surname ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              disabled={registerMutation.isPending}
            />
            {errors.surname && <p className="mt-1 text-sm text-red-500">{errors.surname.message}</p>}
          </div>
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
              disabled={registerMutation.isPending}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
            />
            {errors.repeatPassword && <p className="mt-1 text-sm text-red-500">{errors.repeatPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
            <input
              {...register('phoneNumber', {
                minLength: { value: 9, message: t('error-phone-length') },
                maxLength: { value: 15, message: t('error-phone-length') },
              })}
              type="text"
              placeholder={t('phone')}
              className={`w-full mt-1 p-2 border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              disabled={registerMutation.isPending}
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
          </div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
              registerMutation.isPending ? 'btn-off' : ''
            }`}
          >
            {registerMutation.isPending ? 'Creating account...' : t('register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
