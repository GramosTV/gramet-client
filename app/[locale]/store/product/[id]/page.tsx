'use client';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ProductPage = () => {
  const { id } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/products/${id}`);
      const product = await response.json();
      return product;
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <p>Price: ${data.price}</p>
    </div>
  );
};

export default ProductPage;
