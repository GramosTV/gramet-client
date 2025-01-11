'use client';
import { Category, Color } from '@/app/common';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
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
  //   image: string;
}
const Page = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page, limit, category],
    queryFn: async (): Promise<Res> => {
      const response = await fetchWithAuth(`/api/products/?page=${page}&limit=${limit}&category=${category}`);
      const res = await response.json();
      setPageCount(res?.pageCount);
      return res;
    },
  });

  const mutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetchWithAuth(`/api/cart/${productId}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
    },
    onSuccess: () => {
      toast.success('Product added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add to cart');
    },
  });

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[65vh]">
          {!isPending || !isError
            ? data?.products.map((product) => (
                <div className="bg-white p-4 rounded shadow" key={product._id}>
                  <h2 className="text-xl font-semibold">{product.name}</h2>

                  <p className="mt-2">
                    {product.price} zł{' '}
                    <FontAwesomeIcon icon={faCartPlus} onClick={() => mutation.mutate(product._id)} />
                  </p>
                </div>
              ))
            : null}
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

export default Page;
