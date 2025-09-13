'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time before data is considered stale (5 minutes)
            staleTime: 1000 * 60 * 5,
            // Time before data is garbage collected (10 minutes)
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 3 times with exponential backoff
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for important data
            refetchOnWindowFocus: true,
            // Don't refetch on reconnect by default
            refetchOnReconnect: false,
            // Error handling for queries
            throwOnError: (error: any) => {
              // Let React Error Boundaries handle 5xx errors
              return error?.status >= 500;
            },
          },
          mutations: {
            // Retry failed mutations once
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Retry once for 5xx errors
              return failureCount < 1;
            },
            retryDelay: 1000,
            // Global error handling for mutations
            onError: (error: any) => {
              console.error('Mutation error:', error);
              // Show generic error message if no specific handling
              if (!error?.handled) {
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
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
