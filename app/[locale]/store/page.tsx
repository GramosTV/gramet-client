'use client';
import { Cart, Category, Color, SearchProductRes } from '@/app/common';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatURL } from '@/app/lib/utils';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';

const Store = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [pageCount, setPageCount] = useState(0);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [cart, setCart, removeValue] = useLocalStorage('cart', []);
  const { data, isLoading, isError } = useQuery<SearchProductRes>({
    queryKey: ['products', page, limit, category, minPrice, maxPrice],
    queryFn: async (): Promise<SearchProductRes> => {
      const response = await fetchWithAuth(
        `/api/products/?page=${page}&limit=${limit}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      const res = await response.json();
      setPageCount(res?.pageCount);
      return res;
    },
  });
  const router = useRouter();
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

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let newMin: number | undefined;
    if (rawValue === '') {
      newMin = undefined;
    } else {
      newMin = parseFloat(rawValue);
      if (isNaN(newMin)) return;
      newMin = Math.max(newMin, 0);
    }
    setMinPrice(newMin);
    if (newMin !== undefined) {
      if (maxPrice !== undefined && newMin > maxPrice) {
        setMaxPrice(newMin);
      }
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let newMax: number | undefined;
    if (rawValue === '') {
      newMax = undefined;
    } else {
      newMax = parseFloat(rawValue);
      if (isNaN(newMax)) return;
      newMax = Math.max(newMax, 0);
    }
    setMaxPrice(newMax);
    if (newMax !== undefined) {
      if (minPrice !== undefined && newMax < minPrice) {
        setMinPrice(newMax);
      }
    }
  };

  const t = useTranslations();
  const locale = t('locale');

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] p-4 flex pt-8 justify-center">
      <ul className="menu rounded-box mr-8 w-48 px-0">
        <li className="menu-title">Categories</li>
        <li>
          <Link href={`/store`}>All</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.FURNITURE_HANDLES}`}>Furniture handles</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.FURNITURE_KNOBS}`}>Furniture knobs</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.FURNITURE_HOOKS}`}>Furniture hooks</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.FURNITURE_FEET}`}>Furniture feet</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.FURNITURE_LIGHTING}`}>Furniture lighting</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.TECHNICAL_ACCESSORIES}`}>Technical accessories</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.METAL_DECORATIONS}`}>Metal decorations</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.CARGO_BASKETS}`}>Cargo baskets</Link>
        </li>
        <li>
          <Link href={`/store/?category=${Category.DRAWERS}`}>Drawers</Link>
        </li>
        <li className="menu-title mt-2 ">Price Range</li>
        <li className="menu-title py-1">
          <div className="flex flex-row items-center space-x-2 !bg-transparent">
            <input
              type="number"
              placeholder="Min"
              className="input input-bordered w-16 h-10"
              id="minPrice"
              value={minPrice ?? ''}
              onChange={handleMinPriceChange}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="input input-bordered w-16 h-10"
              id="maxPrice"
              value={maxPrice ?? ''}
              onChange={handleMaxPriceChange}
            />
          </div>
        </li>
      </ul>
      <div className="container max-w-[976px]">
        <div className="breadcrumbs text-sm mb-3 flex justify-between items-end">
          <ul>
            <li>
              <Link href="/store" className="text-xl font-[700]">
                Store
              </Link>
            </li>
            {category ? <li className="text-xl font-[600]">{category}</li> : null}
          </ul>
          {data?.totalCount ? <span className="opacity-50 text-base">Results: {data?.totalCount}</span> : null}
        </div>
        <div className="min-h-[65vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(!isLoading || !isError) && data?.products.length ? (
              data?.products.map((product) => (
                <div
                  className="card w-full max-w-sm bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md cursor-pointer"
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
                  <div className="p-5 pt-0 rounded-b-md">
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
              ))
            ) : (
              <div className="text-black">
                <p>No products found.</p>
                <button
                  className="btn my-2"
                  onClick={() => {
                    setMinPrice(undefined);
                    setMaxPrice(undefined);
                    router.push('/store');
                  }}
                >
                  Return
                </button>
              </div>
            )}
          </div>
        </div>

        {pageCount ? (
          <div className="flex justify-center items-center mt-8">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: pageCount || 0 }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn"
                onClick={() => {
                  setPage((prev) => Math.min(prev + 1, pageCount || 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === pageCount}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Store;
