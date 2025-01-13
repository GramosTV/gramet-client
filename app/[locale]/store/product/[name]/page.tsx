'use client';
import { Color, Product } from '@/app/common';
import { fetchWithAuth } from '@/app/lib/auth-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';
import { useRouter } from 'next/navigation';

const ProductPage = () => {
  const { name } = useParams();
  const router = useRouter();
  const { data, isPending, isError } = useQuery<Product>({
    queryKey: ['product', name],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/products/by-name/${name}`);
      const product = await response.json();
      setSelectedColor(product?.colors[0]._id);
      return product;
    },
  });
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {
    const selectedColorStock = data?.colors.find((color) => color._id === selectedColor)?.stock;
    if (selectedColorStock !== undefined && quantity > selectedColorStock) {
      setQuantity(selectedColorStock);
    }
  }, [selectedColor]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColorStock = data?.colors.find((color) => color._id === selectedColor)?.stock;
    if (selectedColorStock !== undefined && Number(event.target.value) > selectedColorStock) {
      setQuantity(selectedColorStock);
    } else {
      setQuantity(Number(event.target.value));
    }
  };
  const [cart, setCart, removeValue] = useLocalStorage('cart', []);
  const [notif, setNotif] = useState(true);
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
    onError: (error: any) => {
      toast.error('Failed to add to cart');
    },
  });
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setNotif(true);
    e.stopPropagation();
    if (data?._id) mutation.mutate(data._id);
  };

  const handleBuy = () => {
    setNotif(false);
    if (data?._id) mutation.mutate(data._id);
    router.push('/store/checkout');
  };

  if (isPending) {
    return <div>Loading...</div>;
  }
  //TODO: ADD LOADER
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-var(--header-height))] bg-gray-100 flex justify-center items-start">
      <div className="container max-w-[1100px] pt-8">
        <div className="breadcrumbs text-sm mb-3">
          <ul>
            <li>
              <Link href="/store" className="text-xl font-[700]">
                Store
              </Link>
            </li>
            <li className="text-xl font-[600]">
              <Link href={`/store/?category=${data.category}`}>{data.category}</Link>
            </li>
            <li className="text-xl">{data.name}</li>
          </ul>
        </div>
        <div className="bg-base-100 p-8 flex rounded-lg">
          <Carousel>
            {data.images.map((image: string, index: number) => (
              <div key={image}>
                <img src={`data:image/png;base64,${image}`} />
                {/* <p className="legend">Legend {index}</p> */}
              </div>
            ))}
          </Carousel>
          <div className="mx-8">
            <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
            <p className="text-lg text-gray-700 mb-2">Brand: {data.brand}</p>
            <p className="text-lg text-gray-700 mb-2">Code: {data.code}</p>
            <p className="text-lg text-gray-700 mb-2">Price: {data.price.toFixed(2)} zł / unit</p>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">Colors</h2>
              <div className="flex flex-wrap">
                {data.colors.map((color: Color) => (
                  <div
                    key={color.name}
                    className={`mr-4 cursor-pointer p-2 border-2 ${
                      selectedColor === color._id ? ' border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => color._id && setSelectedColor(color._id)}
                  >
                    <div className="w-12 h-12 rounded-full" style={{ backgroundColor: color.hex }}></div>
                    <p className="text-center mt-2">{color.name}</p>
                    {/* <p className="text-center text-sm text-gray-500">Stock: {color.stock}</p> */}
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
                min={data.colors.find((color) => color._id === selectedColor)?.stock ? 1 : 0}
                max={data.colors.find((color) => color._id === selectedColor)?.stock}
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
      </div>
    </div>
  );
};

export default ProductPage;
