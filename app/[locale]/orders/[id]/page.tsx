'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import NotFound from '@/app/components/NotFound';
import Image from 'next/image';
import Link from 'next/link';
import { Order } from '@/app/common/interfaces/order.interface';
import { useOrder } from '@/app/lib/hooks/useOrders';
const OrderPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  // Use React Query hook
  const { data, isPending, isError } = useOrder(id as string);

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <NotFound />;
  }

  return (
    <div className="flex p-6 bg-white max-h-[calc(100vh-var(--header-height))] overflow-y-auto grow pl-16 max-w-[1200px] mx-auto">
      <div className="mx-auto w-full px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Order #{data._id}</h2>

        <div className="mt-6 sm:mt-8 lg:flex lg:gap-8 min-h-[600px]">
          <div className="w-full divide-y flex flex-col justify-between divide-gray-200 overflow-hidden rounded-lg border border-gray-200 lg:max-w-xl xl:max-w-2xl">
            {data.items.map((item: any) => (
              <div className="space-y-4 p-6" key={item._id}>
                <div className="flex items-center gap-6">
                  <Link href={`/store/product/${item.product.url}`} className="h-14 w-14 shrink-0">
                    <Image
                      src={`data:image/png;base64,${item.product.images[0]}`}
                      alt={`${item.product.name} image`}
                      width={120}
                      height={120}
                    />
                  </Link>

                  <Link href={`/store/product/${item.product.url}`} className="">
                    {item.product.name}
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* <p className="text-sm font-normal text-gray-500">
                                    <span className="font-medium text-gray-900">Product ID:</span> {item.product._id}
                                </p> */}

                  <div className="flex items-center justify-end gap-4">
                    <p className="text-base font-normal text-gray-900">x{item.quantity}</p>

                    <p className="text-xl font-bold leading-tight text-gray-900">{item.priceAtTimeOfOrder} zł</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-4 bg-gray-50 p-6">
              <div className="space-y-2">
                <dl className="flex items-center justify-between gap-4">
                  <dt className="font-normal text-gray-500">Original price</dt>
                  <dd className="font-medium text-gray-900">
                    {(
                      data.items.reduce((total: number, item: any) => total + item.product.price, 0) +
                      Number(process.env.NEXT_PUBLIC_FIXED_DELIVERY_COST)
                    ).toFixed(2)}
                    zł
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4">
                  <dt className="font-normal text-gray-500">Delivery</dt>
                  <dd className="font-medium text-gray-900">{process.env.NEXT_PUBLIC_FIXED_DELIVERY_COST} zł</dd>
                </dl>

                {/* <dl className="flex items-center justify-between gap-4">
                  <dt className="font-normal text-gray-500">Savings</dt>
                  <dd className="text-base font-medium text-green-500">
                    -$
                    {data.items
                      .reduce((total, item) => total + (item.product.price - item.priceAtTimeOfOrder), 0)
                      .toFixed(2)}
                  </dd>
                </dl> */}

                {/* <dl className="flex items-center justify-between gap-4">
                  <dt className="font-normal text-gray-500">Store Pickup</dt>
                  <dd className="font-medium text-gray-900 ">$99</dd>
                </dl>

                <dl className="flex items-center justify-between gap-4">
                  <dt className="font-normal text-gray-500 ">Tax</dt>
                  <dd className="font-medium text-gray-900">$799</dd>
                </dl> */}
              </div>

              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                <dt className="text-lg font-bold text-gray-900">Total</dt>
                <dd className="text-lg font-bold text-gray-900">
                  {(
                    data.items.reduce((total: number, item: any) => total + item.priceAtTimeOfOrder, 0) +
                    Number(process.env.NEXT_PUBLIC_FIXED_DELIVERY_COST)
                  ).toFixed(2)}{' '}
                  zł
                </dd>
              </dl>
            </div>
          </div>

          <div className="mt-6 grow sm:mt-8 lg:mt-0 min-h-[100%]">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm h-full">
              <h3 className="text-xl font-semibold text-gray-900">Order history</h3>

              <ol className="relative ms-3 border-s border-gray-200">
                <li className="mb-10 ms-6">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                      />
                    </svg>
                  </span>
                  <h4 className="mb-0.5 text-base font-semibold text-gray-900">
                    Estimated delivery on{' '}
                    {new Date(new Date(data.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </h4>
                  <p className="text-sm font-normal text-gray-500">Order is on its way</p>
                </li>

                {/* <li className="mb-10 ms-6">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                      />
                    </svg>
                  </span>
                  <h4 className="mb-0.5 text-base font-semibold text-gray-900">Today</h4>
                  <p className="text-sm font-normal text-gray-500">Products being delivered</p>
                </li>

                <li className="mb-10 ms-6 text-primary-700">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white">
                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  </span>
                  <h4 className="mb-0.5 font-semibold">23 Nov 2023, 15:15</h4>
                  <p className="text-sm">Products in the courier's warehouse</p>
                </li>

                <li className="mb-10 ms-6 text-primary-700">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white">
                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  </span>
                  <h4 className="mb-0.5 text-base font-semibold">22 Nov 2023, 12:27</h4>
                  <p className="text-sm">Products delivered to the courier - DHL Express</p>
                </li>

                <li className="mb-10 ms-6 text-primary-700">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white">
                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  </span>
                  <h4 className="mb-0.5 font-semibold">19 Nov 2023, 10:47</h4>
                  <p className="text-sm">Payment accepted - VISA Credit Card</p>
                </li>

                <li className="ms-6 text-primary-700">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white">
                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  </span>
                  <div>
                    <h4 className="mb-0.5 font-semibold">19 Nov 2023, 10:45</h4>
                    <a href="#" className="text-sm font-medium hover:underline">
                      Order placed - Receipt #647563
                    </a>
                  </div>
                </li> */}
              </ol>

              {/* <div className="gap-4 sm:flex sm:items-center">
                <button
                  type="button"
                  className="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
                >
                  Cancel the order
                </button>

                <a
                  href="#"
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  sm:mt-0"
                >
                  Order details
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
