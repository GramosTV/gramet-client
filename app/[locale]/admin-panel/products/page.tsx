'use client';
import { Color } from '@/app/common/interfaces/color.interface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAdminProducts, useDeleteProduct } from '@/app/lib/hooks/useProducts';

interface Res {
  products: AdminProduct[];
  pageCount: number;
}
interface AdminProduct {
  _id: string;
  name: string;
  colors: Color[];
  public: boolean;
  objFile?: string; // Added optional objFile field
}

const ViewProducts = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Use React Query hooks
  const { data, isPending, isError } = useAdminProducts({ page, limit });
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  if (isPending) {
    return <div className="py-10 text-center text-sky-600">Fetching products...</div>;
  }
  if (isError) {
    return <div className="py-10 text-center text-red-600">Error fetching products</div>;
  }

  return (
    <div className="p-6 bg-gray-200 text-black max-h-[calc(100vh-var(--header-height))] grow">
      <div className="p-4">
        <div className="mb-4">
          <label className="mr-2">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="p-1 border"
          >
            {[10, 20, 50, 100, 200, 500].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <table className="min-w-full bg-white border shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Total stock</th>
              <th className="px-4 py-2 text-left">Is public</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((item: AdminProduct, idx: number) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {item.colors.reduce((total: number, color: Color) => total + color.stock, 0)}
                  </div>
                </td>
                <td className="px-4 py-2">{item.public ? 'Yes' : 'No'}</td>
                <td className="flex justify-end px-4 py-2 space-x-2">
                  <Link
                    href={{
                      pathname: `/admin-panel/products/edit/${item._id}`,
                    }}
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === data?.pageCount}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
