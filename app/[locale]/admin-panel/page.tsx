'use client';
import React from 'react';
import AddProducts from './products/add/page';
import Link from 'next/link';
import AdminLayout from './layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faBox,
  faDollar,
  faMoneyBill,
  faShoppingBag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@/app/common';
import { fetchWithAuth } from '@/app/lib/auth-api';
import Loading from '@/app/components/Loading';
import NotFound from '@/app/components/NotFound';

const AdminPanel = () => {
  const { data, error, isLoading } = useQuery<Order[]>({
    queryKey: ['ordersForAdmin'],
    queryFn: async () => {
      const response = await fetchWithAuth(`/api/orders/allForAdmin`);
      return await response.json();
    },
    retry: 1,
  });
  if (isLoading) return <Loading/>;
  if (error) return <NotFound />;
  return (
    <>
      <div className="p-6 bg-gray-200 text-black max-h-[calc(100vh-var(--header-height))] grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
          {[
            { icon: faUser, count: 1257, label: 'Visitors' },
            { icon: faShoppingBag, count: data?.length || 0, label: 'Orders' },
            { icon: faDollar, count: 11257, label: 'Sales' },
            { icon: faBox, count: 221, label: 'Packages to dispatch' },
          ].map((item, index) => (
            <div key={index} className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <FontAwesomeIcon icon={item.icon} color="#000" size="2x" />
              </div>
              <div className="text-right">
                <p className="text-2xl">{item.count}</p>
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 mx-4">
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Delivery Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {data?.map((order, index) => (
                    <tr key={index} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <div className="flex justify-center items-center w-full h-full">
                              <FontAwesomeIcon icon={faUser} size="2x" />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">Client name</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Client role</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">${order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${order.paymentStatus === 'completed' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' : order.paymentStatus === 'pending' ? 'text-yellow-700 bg-yellow-100' : order.paymentStatus === 'failed' ? 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700' : 'text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${order.deliveryStatus === 'delivered' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' : order.deliveryStatus === 'dispatched' ? 'text-yellow-700 bg-yellow-100' : order.deliveryStatus === 'not_dispatched' ? 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700' : 'text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'}`}>
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span className="flex items-center col-span-3"> Showing 21-30 of 100 </span>
              <span className="col-span-2"></span>

              <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul className="inline-flex items-center">
                    <li>
                      <button
                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                        aria-label="Previous"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-blue-600 dark:bg-gray-100 border border-r-0 border-blue-600 dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple">
                        1
                      </button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">2</button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">3</button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">4</button>
                    </li>
                    <li>
                      <span className="px-3 py-1">...</span>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">8</button>
                    </li>
                    <li>
                      <button className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">9</button>
                    </li>
                    <li>
                      <button
                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                        aria-label="Next"
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
