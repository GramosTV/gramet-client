import { useMutation, useQueryClient } from '@tanstack/react-query';
import { safeFetch, createMutationErrorHandler, showSuccessToast, showErrorToast } from '../error-handling';
import { setAccessToken } from '../auth-api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import * as jose from 'jose';
import Cookies from 'js-cookie';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  phoneNumber?: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  password: string;
  repeatPassword: string;
  token: string;
}

export function useLogin() {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await safeFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: (result) => {
      setAccessToken(result.accessToken);
      setUser(jose.decodeJwt(result.accessToken));
      showSuccessToast('Login successful!');
      router.push('/');
    },
    onError: (error: any) => {
      if (error.status === 401) {
        const message = error.message?.includes('email') ? 'Please validate your email' : 'Invalid email or password';
        showErrorToast(message);
      } else {
        showErrorToast(error, 'Login failed. Please try again.');
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await safeFetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      showSuccessToast('Registration successful! Please check your email to verify your account.');
      router.push('/login');
    },
    onError: (error: any) => {
      if (error.status === 409) {
        showErrorToast('An account with this email already exists.');
      } else if (error.status === 422) {
        showErrorToast('Please check your input and try again.');
      } else {
        showErrorToast(error, 'Registration failed. Please try again.');
      }
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await safeFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      showSuccessToast('Password reset email sent! Please check your inbox.');
      router.push('/login');
    },
    onError: (error: any) => {
      if (error.status === 404) {
        showErrorToast('No account found with this email address.');
      } else if (error.status === 429) {
        showErrorToast('Too many requests. Please wait before trying again.');
      } else {
        showErrorToast(error, 'Failed to send reset email. Please try again.');
      }
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await safeFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      showSuccessToast('Password reset successful! You can now log in with your new password.');
      router.push('/login');
    },
    onError: (error: any) => {
      if (error.status === 400) {
        showErrorToast('Invalid or expired reset token. Please request a new password reset.');
      } else if (error.status === 422) {
        showErrorToast('Invalid password format. Please ensure your password meets the requirements.');
      } else {
        showErrorToast(error, 'Failed to reset password. Please try again.');
      }
    },
  });
}

export function useLogout() {
  const { setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await safeFetch('/api/auth/logout', {
        method: 'DELETE',
      });
      return await response.json();
    },
    onSuccess: () => {
      setUser(null);
      setAccessToken('');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      queryClient.clear(); // Clear all cached data
      showSuccessToast('Successfully logged out');
      router.push('/');
    },
    onError: (error) => {
      // Even if the server logout fails, we should clear local state
      setUser(null);
      setAccessToken('');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      queryClient.clear();
      showErrorToast('Logout completed locally (server error occurred)');
      router.push('/');
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await safeFetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      return await response.json();
    },
    onSuccess: () => {
      showSuccessToast('Email verified successfully!');
    },
    onError: (error: any) => {
      if (error.status === 400 || error.status === 404) {
        showErrorToast('Invalid or expired verification token.');
      } else {
        showErrorToast(error, 'Failed to verify email. Please try again.');
      }
    },
  });
}
