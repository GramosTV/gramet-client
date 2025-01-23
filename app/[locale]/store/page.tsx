'use client';
import { Cart, Category, Color } from '@/app/common';
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
interface Res {
  products: SearchProduct[];
  pageCount: number;
}
interface SearchProduct {
  _id: string;
  name: string;
  price: number;
  public: boolean;
  image: string;
  url: string;
  //   image: string;
}
const Store = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [cart, setCart, removeValue] = useLocalStorage('cart', []);
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page, limit, category],
    queryFn: async (): Promise<Res> => {
      const response = await fetchWithAuth(`/api/products/?page=${page}&limit=${limit}&category=${category}`);
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
    mutation.mutate(id);
  };
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] bg-gray-100 p-4 flex pt-8 justify-center">
      <ul className="menu  rounded-box w-48 mr-3">
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
      </ul>
      <div className="container max-w-[1100px]">
        <div className="breadcrumbs text-sm mb-3">
          <ul>
            <li>
              <Link href="/store" className="text-xl font-[700]">
                Store
              </Link>
            </li>
            {category ? <li className="text-xl font-[600]">{category}</li> : null}
          </ul>
        </div>
        <div className="min-h-[65vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {!isPending || !isError
              ? data?.products.map((product) => (
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
                    <div className="py-4 px-6 bg-slate-200 rounded-b-md">
                      <h2
                        className="card-title text-lg font-bold inline-block cursor-pointer"
                        onClick={() => router.push(`/store/product/${product.url}`)}
                      >
                        {product.name}
                      </h2>
                      <div className="flex items-center justify-between">
                        <span className="text-md font-semibold">{product.price} zł / unit</span>
                        <button
                          className="btn btn-outline flex items-center gap-2"
                          onClick={(e) => handleAddToCart(e, product._id)}
                        >
                          <FontAwesomeIcon icon={faCartPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>

        {pageCount ? (
          <div className="flex justify-center items-center mt-8">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: pageCount || 0 }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn"
                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount || 1))}
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
