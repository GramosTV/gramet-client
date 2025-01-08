'use client';
import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { fetchWithAuth } from '../../../lib/auth-api';

type Color = {
  name: string;
  hex: string;
  stock: number;
};

type ProductFormValues = {
  name: string;
  brand: string;
  code: string;
  colors: Color[];
  material: string[];
  price: number;
  images: FileList;
};

const AddProducts: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
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

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('code', data.code);
    formData.append('price', data.price.toString());
    formData.append('material', JSON.stringify(data.material));
    formData.append('colors', JSON.stringify(data.colors));

    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetchWithAuth('/api/products', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-md shadow-md flex-grow">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            placeholder="Product Name"
            className={`w-full mt-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Brand Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            {...register('brand', { required: 'Brand is required' })}
            type="text"
            placeholder="Product Brand"
            className={`w-full mt-1 p-2 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        {/* Code Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <input
            {...register('code', { required: 'Code is required' })}
            type="text"
            placeholder="Product Code"
            className={`w-full mt-1 p-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
        </div>

        {/* Colors Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Colors</label>
          <div className="space-y-4">
            {colorFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <input
                  {...register(`colors.${index}.name` as const, { required: 'Color name is required' })}
                  type="text"
                  placeholder="Color Name"
                  className={`w-1/3 p-2 border ${
                    errors.colors?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <input
                  {...register(`colors.${index}.hex` as const, { required: 'Hex code is required' })}
                  type="text"
                  placeholder="#FFFFFF"
                  className={`w-1/3 p-2 border ${
                    errors.colors?.[index]?.hex ? 'border-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <input
                  {...register(`colors.${index}.stock` as const, {
                    required: 'Stock is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Stock must be 0 or more' },
                  })}
                  type="number"
                  placeholder="Stock"
                  className={`w-1/3 p-2 border ${
                    errors.colors?.[index]?.stock ? 'border-red-500' : 'border-gray-300'
                  } rounded-md`}
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addColor({ name: '', hex: '', stock: 0 })}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Color
            </button>
          </div>
        </div>

        {/* Materials Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Materials</label>
          <Controller
            name="material"
            control={control}
            rules={{ required: 'At least one material is required' }}
            render={({ field: { value = [], onChange } }) => (
              <div className="space-y-2 mt-1">
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
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 capitalize">{material}</span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>}
        </div>

        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price must be greater than or equal to 0' },
            })}
            type="number"
            placeholder="Product Price"
            className={`w-full mt-1 p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        {/* Images Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            {...register('images', { required: 'Images are required' })}
            type="file"
            multiple
            className={`w-full mt-1 p-2 border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
