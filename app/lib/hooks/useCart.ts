import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '../auth-api';
import { showSuccessToast, showErrorToast, createMutationErrorHandler } from '../error-handling';
import { Cart } from '@/app/common/interfaces/cart.interface';
import { useLocalStorage } from 'usehooks-ts';
import { useAuth } from '@/context/AuthContext';

// Get cart data
export function useCart() {
  const { user } = useAuth();
  const [localCart, setLocalCart] = useLocalStorage<Cart>('cart', []);

  return useQuery({
    queryKey: ['cart', user?.sub],
    queryFn: async (): Promise<Cart> => {
      if (!user) {
        return localCart;
      }

      const response = await fetchWithAuth('/api/cart');
      const data = await response.json();
      setLocalCart(data.itemData);
      return data.itemData;
    },
    enabled: true, // Always enabled, will return local cart if not logged in
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();
  const [, setLocalCart] = useLocalStorage<Cart>('cart', []);
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
      colorId = '',
    }: {
      productId: string;
      quantity?: number;
      colorId?: string;
    }) => {
      const response = await fetchWithAuth('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          colorId,
        }),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(['cart', user?.sub], data.itemData);
      setLocalCart(data.itemData);
      showSuccessToast('Product added to cart successfully');
    },
    onError: (error: any) => {
      if (error.status === 401) {
        showErrorToast('Please log in to add items to cart');
      } else if (error.message?.includes('stock') || error.message?.includes('inventory')) {
        showErrorToast('Sorry, this item is out of stock');
      } else {
        showErrorToast(error, 'Failed to add item to cart. Please try again.');
      }
    },
  });
}

// Update cart item quantity
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  const [, setLocalCart] = useLocalStorage<Cart>('cart', []);
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      colorId = '',
    }: {
      productId: string;
      quantity: number;
      colorId?: string;
    }) => {
      const response = await fetchWithAuth('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          colorId,
        }),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', user?.sub], data.itemData);
      setLocalCart(data.itemData);
      showSuccessToast('Cart updated successfully');
    },
    onError: createMutationErrorHandler('Failed to update cart quantity'),
  });
}

// Remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const [, setLocalCart] = useLocalStorage<Cart>('cart', []);
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, colorId = '' }: { productId: string; colorId?: string }) => {
      const response = await fetchWithAuth(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colorId }),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cart', user?.sub], data.itemData);
      setLocalCart(data.itemData);
      showSuccessToast('Item removed from cart');
    },
    onError: createMutationErrorHandler('Failed to remove item from cart'),
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();
  const [, setLocalCart] = useLocalStorage<Cart>('cart', []);
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('/api/cart', {
        method: 'DELETE',
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['cart', user?.sub], []);
      setLocalCart([]);
      showSuccessToast('Cart cleared successfully');
    },
    onError: createMutationErrorHandler('Failed to clear cart'),
  });
}
