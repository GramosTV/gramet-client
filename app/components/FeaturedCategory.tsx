'use client';
import React from 'react';
import { Category, getCategory, SearchProduct } from '../common';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../lib/auth-api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';
import { useAuth } from '@/context/AuthContext';

const page = ({ products, category }: { products: SearchProduct[]; category: Category }) => {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const [cart, setCart, removeValue] = useLocalStorage('cart', []);
  const locale = t('locale');
  const mutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetchWithAuth(`/api/cart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          colorId: '',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return await response.json();
    },
    onSuccess: (res) => {
      setCart(res.itemData);
      toast.success('Product added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add to cart');
    },
  });

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    user ? mutation.mutate(id) : router.push('/login');
  };
  return (
    <div className="max-w-[1200px] mx-auto my-24">
      <h1 className="text-3xl text-center mb-6">{locale === 'en' ? category : getCategory(category, locale)}</h1>
      <div className="flex justify-center">
        {products?.map((product) => (
          <div
            className="card w-full max-w-sm bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md cursor-pointer mx-4"
            key={product._id}
          >
            <div
              className="relative w-full h-40 my-4 cursor-pointer"
              onClick={() => router.push(`/store/product/${product.url}`)}
            >
              <Image
                src={`data:image/png;base64,${product.image}`}
                alt={`${product.name} image`}
                fill
                className="object-contain overflow-hidden"
              />
            </div>
            <div className="pb-5 px-4 rounded-b-md">
              <div className="flex items-center justify-between">
                <div className="flex justify-between flex-col">
                  <h2
                    className="card-title text-base font-bold inline-block cursor-pointer"
                    onClick={() => router.push(`/store/product/${product.url}`)}
                  >
                    {locale === 'pl' ? product.name : product.enName}
                  </h2>
                  <span className="text-sm">{product.price} zł / unit</span>
                </div>
                <button
                  className="btn btn-outline flex items-center gap-2 hover:bg-blue-700 min-h-0 h-auto p-3 rounded-xl"
                  onClick={(e) => handleAddToCart(e, product._id)}
                >
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
