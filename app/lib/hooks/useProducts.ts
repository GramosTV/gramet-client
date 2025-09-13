import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '../auth-api';
import { showSuccessToast, createMutationErrorHandler } from '../error-handling';
import { SearchProductRes } from '@/app/common/interfaces/search-product.interface';
import { Product } from '@/app/common/interfaces/product.interface';
import { Category } from '@/app/common/enums/category.enum';

interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: Category | string | null;
  minPrice?: number;
  maxPrice?: number;
}

interface AdminProductsParams {
  page?: number;
  limit?: number;
}

// Get products for store page
export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<SearchProductRes> => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.category) searchParams.set('category', params.category.toString());
      if (params.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());

      const response = await fetchWithAuth(`/api/products/?${searchParams.toString()}`);
      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single product by name/url
export function useProduct(productName: string) {
  return useQuery({
    queryKey: ['product', productName],
    queryFn: async (): Promise<Product> => {
      const response = await fetchWithAuth(`/api/products/name/${productName}`);
      return await response.json();
    },
    enabled: !!productName,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get products for admin panel
export function useAdminProducts(params: AdminProductsParams) {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());

      const response = await fetchWithAuth(`/api/products/admin/?${searchParams.toString()}`);
      return await response.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for admin data
  });
}

// Create product (admin)
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: FormData) => {
      const response = await fetchWithAuth('/api/products', {
        method: 'POST',
        body: productData, // FormData for file uploads
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccessToast('Product created successfully');
    },
    onError: createMutationErrorHandler('Failed to create product'),
  });
}

// Update product (admin)
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productData }: { id: string; productData: FormData }) => {
      const response = await fetchWithAuth(`/api/products/${id}`, {
        method: 'PUT',
        body: productData,
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      showSuccessToast('Product updated successfully');
    },
    onError: createMutationErrorHandler('Failed to update product'),
  });
}

// Delete product (admin)
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetchWithAuth(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccessToast('Product deleted successfully');
    },
    onError: (error: any) => {
      if (error.status === 404) {
        showSuccessToast('Product not found');
      } else if (error.status === 409) {
        showSuccessToast('Cannot delete product. It may be referenced in existing orders.');
      } else {
        createMutationErrorHandler('Failed to delete product')(error);
      }
    },
  });
}

// Get product by ID (admin)
export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: ['admin-product', productId],
    queryFn: async (): Promise<Product> => {
      const response = await fetchWithAuth(`/api/products/admin/${productId}`);
      return await response.json();
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
