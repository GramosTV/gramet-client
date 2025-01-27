'use client';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../lib/auth-api';
import { useLocalStorage } from 'usehooks-ts';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { toast } from 'react-toastify';
import { Color, Product as ProductType } from '../common';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import ObjViewer from './ObjViewers';

const Product = ({ product }: { product: ProductType }) => {
  const [cart, setCart, removeValue] = useLocalStorage('cart', []);
  const [notif, setNotif] = useState(true);
  const router = useRouter();
  const [show3DView, setShow3DView] = useState(false);
  const mutation = useMutation({
    mutationFn: async (productId: string, notif = true) => {
      const response = await fetchWithAuth(`/api/cart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          colorId: selectedColor,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return await response.json();
    },
    onSuccess: (res) => {
      setCart(res.itemData);
      if (notif) toast.success('Product added successfully');
    },
    onError: () => {
      toast.error('Failed to add to cart');
    },
  });

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setNotif(true);
    e.stopPropagation();
    if (product._id) mutation.mutate(product._id);
  };

  const handleBuy = () => {
    setNotif(false);
    if (product._id) mutation.mutate(product._id);
    router.push('/checkout');
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColorStock = product.colors.find((color) => color._id === selectedColor)?.stock;
    if (selectedColorStock !== undefined && Number(event.target.value) > selectedColorStock) {
      setQuantity(selectedColorStock);
    } else {
      setQuantity(Number(event.target.value));
    }
  };

  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?._id || '');
  const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {
    const selectedColorStock = product.colors.find((color) => color._id === selectedColor)?.stock;
    if (selectedColorStock !== undefined && quantity > selectedColorStock) {
      setQuantity(selectedColorStock);
    }
  }, [selectedColor, product.colors, quantity]);
  return (
    <div className="bg-base-100 p-8 flex rounded-lg">
      <div className="flex flex-col max-w-[440px]">
        {show3DView ? (
          <ObjViewer
            objBase64={`${process.env.NEXT_PUBLIC_API_URL}/products/obj/`}
            productId={product._id}
            color={product.colors.find((color) => color._id === selectedColor)?.hex || '#dddddd'}
          />
        ) : (
          <Carousel>
            {product.images.map((image: string) => (
              <div key={image}>
                <img src={`data:image/png;base64,${image}`} />
              </div>
            ))}
          </Carousel>
        )}
        <button className="btn btn-sm mb-4" onClick={() => setShow3DView(!show3DView)}>
          {show3DView ? 'Show Images' : 'Show 3D'}
        </button>
      </div>
      <div className="mx-8">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg text-gray-700 mb-2">
          <b>Brand:</b> {product.brand}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <b>Code:</b> {product.code}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <b>Price:</b> {product.price.toFixed(2)} zł / unit
        </p>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Colors</h2>
          <div className="flex flex-wrap">
            {product.colors.map((color: Color) => (
              <div
                key={color.name}
                className={`mr-4 cursor-pointer p-2 border-2 ${
                  selectedColor === color._id ? ' border-blue-500' : 'border-transparent'
                }`}
                onClick={() => color._id && setSelectedColor(color._id)}
              >
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: color.hex }} />
                <p className="text-center mt-2">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Quantity</h2>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={product.colors.find((color) => color._id === selectedColor)?.stock ? 1 : 0}
            max={product.colors.find((color) => color._id === selectedColor)?.stock}
            className="border-2 rounded p-2 w-20"
          />
        </div>
        <div className="flex gap-2 mb-2">
          <button className="btn btn-outline flex items-center" onClick={(e) => handleAddToCart(e)}>
            <FontAwesomeIcon icon={faCartPlus} />
          </button>
          <button className="btn btn-neutral flex items-center px-12" onClick={handleBuy}>
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
