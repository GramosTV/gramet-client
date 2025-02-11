import { fetchWithAuth } from './auth-api';

export const addToCart = async (productId: string, colorId: string = '') => {
  const response = await fetchWithAuth(`/api/cart`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      quantity: 1,
      colorId,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }
  return await response.json();
};
