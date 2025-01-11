'use client';
import { Color, Category } from '@/app/common';
import { fetchWithAuth } from '@/app/lib/auth-api';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useParams, redirect } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ProductFormValues {
  name: string;
  brand: string;
  code: string;
  colors: Color[];
  materials: string[];
  price: number;
  images: FileList;
  public: boolean;
  category: Category;
}

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>();

  const {
    fields: colorFields,
    append: addColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: 'colors',
  });
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const { isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/products/${id}`);
      const product = await response.json();
      setValue('name', product.name);
      setValue('brand', product.brand);
      setValue('code', product.code);
      setValue('colors', product.colors);
      setValue('materials', product.materials);
      setValue('price', product.price);
      setValue('public', product.public);
      setValue('category', product.category);
      setImages(product.images);
      return product;
    },
  });
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetchWithAuth(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      router.push('/admin-panel/products/view');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product');
    },
  });
  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('code', data.code);
    formData.append('price', data.price.toString());
    formData.append('materials', JSON.stringify(data.materials));
    formData.append('colors', JSON.stringify(data.colors));
    formData.append('public', data.public as any);
    formData.append('category', data.category);

    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    });

    mutation.mutate(formData);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  if (isPending) {
    return <div className="py-10 text-center text-sky-600">Fetching product...</div>;
  }
  if (isError) {
    return <div className="py-10 text-center text-red-600">Error fetching product</div>;
  }

  return (
    <div className="max-w-2xl p-6 bg-gray-200 text-black max-h-[calc(100vh-var(--header-height))] overflow-y-auto grow pl-16">
      <h1 className="mb-4 text-xl font-bold">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        {/* ... existing fields ... */}

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className={`w-full mt-1 p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          >
            <option value="">Select Category</option>
            {Object.values(Category).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
        </div>

        {/* Images Field */}
        {/* ... existing fields ... */}

        {/* Public Field */}
        {/* ... existing fields ... */}

        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
