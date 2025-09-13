'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type ErrorWithStatus = Error & { status?: number; handled?: boolean };

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount, error: ErrorWithStatus) => {
              if (error.status !== undefined && error.status >= 400 && error.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: true,
            refetchOnReconnect: false,
            throwOnError: (error: ErrorWithStatus) => {
              return error.status !== undefined && error.status >= 500;
            },
          },
          mutations: {
            retry: (failureCount, error: ErrorWithStatus) => {
              if (error.status !== undefined && error.status >= 400 && error.status < 500) {
                return false;
              }
              return failureCount < 1;
            },
            retryDelay: 1000,
            onError: (error: ErrorWithStatus) => {
              console.error('Mutation error:', error);
              if (!error.handled) {
                toast.error('An unexpected error occurred. Please try again.');
              }
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isClient && process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
