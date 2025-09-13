import { toast } from 'react-toastify';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Handle common fetch/network errors
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('Unauthorized')) {
      return 'Please log in to continue.';
    }
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  // Handle API error responses
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get appropriate error message based on status code
 */
export function getStatusErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with existing data.';
    case 422:
      return 'Invalid data provided. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Enhanced error handler for API responses
 */
export async function handleApiError(response: Response): Promise<never> {
  const status = response.status;
  let errorMessage = getStatusErrorMessage(status);
  let errorDetails;

  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    }
    errorDetails = errorData;
  } catch {
    // Response doesn't contain JSON, use status-based message
  }

  throw new AppError(errorMessage, status, response.statusText, errorDetails);
}

/**
 * Standardized error notification
 */
export function showErrorToast(error: unknown, fallbackMessage?: string): void {
  const message = getErrorMessage(error) || fallbackMessage || 'Something went wrong';
  toast.error(message);
}

/**
 * Standardized success notification
 */
export function showSuccessToast(message: string): void {
  toast.success(message);
}

/**
 * Log error for debugging/monitoring
 */
export function logError(error: unknown, context?: string): void {
  const errorInfo = {
    message: getErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
  };

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // Here you can send to external error monitoring service
  // Example: Sentry, LogRocket, Datadog, etc.
  // sendToErrorService(errorInfo);
}

/**
 * Generic error handler for React Query mutations
 */
export function createMutationErrorHandler(customMessage?: string) {
  return (error: any) => {
    // Mark error as handled to prevent global handler from showing generic message
    if (error && typeof error === 'object') {
      error.handled = true;
    }

    logError(error, 'Mutation Error');
    showErrorToast(error, customMessage);
  };
}

/**
 * Generic error handler for React Query queries
 */
export function createQueryErrorHandler(customMessage?: string) {
  return (error: unknown) => {
    logError(error, 'Query Error');
    // For queries, we might not always want to show toast immediately
    // depending on the component's error handling strategy
    if (customMessage) {
      showErrorToast(error, customMessage);
    }
  };
}

/**
 * Query keys for cache invalidation
 */
export const QUERY_KEYS = {
  // Auth related
  user: ['user'],

  // Cart related
  cart: ['cart'],

  // Products related
  products: ['products'],
  adminProducts: ['admin-products'],
  product: (id: string) => ['product', id],

  // Orders related
  orders: ['orders'],
  adminOrders: ['admin-orders'],
  order: (id: string) => ['order', id],
  adminStatistics: ['admin-statistics'],
} as const;

/**
 * Helper to invalidate related queries after mutations
 */
export function getRelatedQueryKeys(action: string) {
  switch (action) {
    case 'cart-update':
      return [QUERY_KEYS.cart];
    case 'product-create':
    case 'product-update':
    case 'product-delete':
      return [QUERY_KEYS.products, QUERY_KEYS.adminProducts];
    case 'order-create':
      return [QUERY_KEYS.orders, QUERY_KEYS.cart, QUERY_KEYS.adminOrders, QUERY_KEYS.adminStatistics];
    case 'order-dispatch':
      return [QUERY_KEYS.adminOrders, QUERY_KEYS.adminStatistics];
    default:
      return [];
  }
}

/**
 * Wrapper for fetch requests with enhanced error handling
 */
export async function safeFetch(url: string, options?: RequestInit, customErrorMessage?: string): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      await handleApiError(response);
    }

    return response;
  } catch (error) {
    logError(error, `Fetch to ${url}`);

    if (error instanceof AppError) {
      throw error;
    }

    // Handle network errors
    throw new AppError(
      customErrorMessage || 'Network error. Please check your connection and try again.',
      0,
      'NETWORK_ERROR'
    );
  }
}

/**
 * Enhanced retry configuration for React Query
 */
export function getRetryConfig(maxRetries: number = 3) {
  return {
    retry: (failureCount: number, error: unknown) => {
      // Don't retry for certain error types
      if (error instanceof AppError) {
        // Don't retry client errors (4xx)
        if (error.status && error.status >= 400 && error.status < 500) {
          return false;
        }
      }

      return failureCount < maxRetries;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  };
}
