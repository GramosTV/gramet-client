'use client';
import { Color } from '@/app/common';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
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
  const [limit, setLimit] = useState(10);
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page, limit],
    queryFn: async (): Promise<Res> => {
      const response = await fetchWithAuth(`/api/products/?page=${page}&limit=${limit}`);
      return response.json();
    },
  });
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.products.map((product) => (
            <div className="bg-white p-4 rounded shadow" key={product._id}>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="mt-2">{product.price} zł</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
