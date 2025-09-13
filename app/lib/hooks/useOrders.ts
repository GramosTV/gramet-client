import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '../auth-api';
import { showSuccessToast, createMutationErrorHandler } from '../error-handling';
import { Order } from '@/app/common/interfaces/order.interface';
import { ShippingFormInputs } from '@/app/common/interfaces/shipping-form-inputs.interface';
import { useRouter } from 'next/navigation';

// Get user's orders
export function useUserOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const response = await fetchWithAuth('/api/orders/all');
      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single order by ID
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<Order> => {
      const response = await fetchWithAuth(`/api/orders/findbyId/${orderId}`);
      return await response.json();
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get admin orders with pagination
export function useAdminOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['admin-orders', page, limit],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/orders/forAdmin/?page=${page}&limit=${limit}`);
      return await response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for admin data
  });
}

// Get admin statistics
export function useAdminStatistics() {
  return useQuery({
    queryKey: ['admin-statistics'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/orders/statistics');
      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create order (checkout)
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (shippingInfo: ShippingFormInputs) => {
      const response = await fetchWithAuth('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingInfo),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidate cart and orders cache
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      showSuccessToast('Order placed successfully!');
      router.push(`/checkout/confirmation/${data.transactionId}`);
    },
    onError: (error: any) => {
      if (error.status === 422) {
        showSuccessToast('Invalid order information. Please check your details and try again.');
      } else if (error.status === 409) {
        showSuccessToast('Some items in your cart are no longer available');
      } else {
        createMutationErrorHandler('Failed to place order. Please try again.')(error);
      }
    },
  });
}

// Dispatch order (admin)
export function useDispatchOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetchWithAuth(`/api/orders/dispatch/${orderId}`, {
        method: 'PATCH',
      });
      return await response.json();
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-statistics'] });

      showSuccessToast('Order dispatched successfully');
      router.push('/admin-panel');
    },
    onError: (error: any) => {
      if (error.status === 404) {
        showSuccessToast('Order not found');
      } else if (error.status === 409) {
        showSuccessToast('Order has already been dispatched');
      } else {
        createMutationErrorHandler('Failed to dispatch order')(error);
      }
    },
  });
}

// Update order status (admin)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await fetchWithAuth(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-statistics'] });

      showSuccessToast('Order status updated successfully');
    },
    onError: createMutationErrorHandler('Failed to update order status'),
  });
}

// Cancel order
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetchWithAuth(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });
      return await response.json();
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });

      showSuccessToast('Order cancelled successfully');
    },
    onError: (error: any) => {
      if (error.status === 409) {
        showSuccessToast('Order cannot be cancelled as it has already been processed');
      } else {
        createMutationErrorHandler('Failed to cancel order')(error);
      }
    },
  });
}
