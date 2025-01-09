import React from 'react';
import LoginForm from '../../components/LoginForm';
import { useTranslations } from 'next-intl';

const Login = () => {
  const t = useTranslations('Login');
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
};

export default Login;
