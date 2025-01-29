'use client';
//TO DO - image preview before add
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
  enName: string;
  brand: string;
  code: string;
  colors: Color[];
  materials: string[];
  price: number;
  images: FileList;
  public: boolean;
  category: Category;
  objFile?: FileList;
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
      const response = await fetchWithAuth(`/api/products/byId/${id}`);
      const product = await response.json();
      setValue('name', product.name);
      setValue('enName', product.enName);
      setValue('brand', product.brand);
      setValue('code', product.code);
      setValue('colors', product.colors);
      setValue('materials', product.materials);
      setValue('price', product.price);
      setValue('public', product.public);
      setValue('category', product.category);
      setImages(product.images);
      setImagePreviews(
        product.images.map((file: string) => {
          const binaryString = atob(file);
          const bytes = Uint8Array.from(binaryString, (ch) => ch.charCodeAt(0));
          const blob = new Blob([bytes], { type: 'image/png' });
          return URL.createObjectURL(blob);
        })
      );
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
      router.push('/admin-panel/products');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product');
    },
  });
  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('enName', data.enName);
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
    if (data.objFile) {
      Array.from(data.objFile).forEach((file) => {
        formData.append('objFile', file);
      });
    }
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
        <div className="flex justify-between">
          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="Product Name"
              className={`w-full mt-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* English Name Field */}
          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">English Name</label>
            <input
              {...register('enName', { required: 'English Name is required' })}
              type="text"
              placeholder="Product English Name"
              className={`w-full mt-1 p-2 border ${errors.enName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.enName && <p className="mt-1 text-sm text-red-500">{errors.enName.message}</p>}
          </div>
        </div>
        <div className="flex justify-between">
          {/* Brand Field */}
          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              {...register('brand', { required: 'Brand is required' })}
              type="text"
              placeholder="Product Brand"
              className={`w-full mt-1 p-2 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
          </div>

          {/* Code Field */}
          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              {...register('code', { required: 'Code is required' })}
              type="text"
              placeholder="Product Code"
              className={`w-full mt-1 p-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>}
          </div>
        </div>

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

        {/* Colors Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Colors</label>
          <div className="overflow-x-auto mt-2">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Hex</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {colorFields.map((field, index) => (
                  <tr key={field.id}>
                    <td>
                      <input
                        {...register(`colors.${index}.name` as const, { required: 'Color name is required' })}
                        type="text"
                        placeholder="Color Name"
                        className={`input input-bordered w-full ${errors.colors?.[index]?.name ? 'input-error' : ''}`}
                      />
                    </td>
                    <td>
                      <input
                        {...register(`colors.${index}.hex` as const, { required: 'Hex code is required' })}
                        type="text"
                        placeholder="#FFFFFF"
                        className={`input input-bordered w-full ${errors.colors?.[index]?.hex ? 'input-error' : ''}`}
                      />
                    </td>
                    <td>
                      <input
                        {...register(`colors.${index}.stock` as const, {
                          required: 'Stock is required',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Stock must be 0 or more' },
                        })}
                        type="number"
                        placeholder="Stock"
                        className={`input input-bordered w-full ${errors.colors?.[index]?.stock ? 'input-error' : ''}`}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => removeColor(index)} className="btn btn-error">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => addColor({ name: '', hex: '', stock: 0 })}
            className="mt-2 btn btn-primary"
          >
            Add Color
          </button>
        </div>

        {/* Materials Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Materials</label>
          <Controller
            name="materials"
            control={control}
            rules={{ required: 'At least one material is required' }}
            render={({ field: { value = [], onChange } }) => (
              <div className="mt-1 space-y-2">
                {['leather', 'cotton', 'synthetic'].map((material) => (
                  <label key={material} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value.includes(material)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...value, material]
                          : value.filter((v: string) => v !== material);
                        onChange(newValue);
                      }}
                      className="border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">{material}</span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.materials && <p className="mt-1 text-sm text-red-500">{errors.materials.message}</p>}
        </div>

        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price must be greater than or equal to 0' },
              validate: (value) =>
                /^\d+(\.\d{1,2})?$/.test(value.toString()) || 'Price must have up to 2 decimal places',
            })}
            type="number"
            step="0.01"
            placeholder="Product Price"
            className={`w-full mt-1 p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
        </div>

        {/* Images Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            {...register('images')}
            type="file"
            multiple
            onChange={handleImageChange}
            className={`bg-gray-300 w-full mt-1 p-2 border ${
              errors.images ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} className="object-cover w-24 h-24 rounded-md" />
            ))}
          </div>
        </div>

        {/* .obj File Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">3D Model (.obj)</label>
          <input
            {...register('objFile')}
            type="file"
            accept=".obj"
            className={`bg-gray-300 w-full mt-1 p-2 border ${
              errors.objFile ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {errors.objFile && <p className="mt-1 text-sm text-red-500">{errors.objFile.message}</p>}
        </div>

        {/* Public Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Public</label>
          <input {...register('public')} type="checkbox" className="mt-1" />
        </div>

        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
