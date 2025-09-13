'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faBox,
  faBoxesStacked,
  faDollar,
  faShoppingBag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import NotFound from '@/app/components/NotFound';
import { useRouter } from 'next/navigation';
import { PaymentStatus } from '@/app/common/enums/payment-status.enum';
import { DeliveryStatus } from '@/app/common/enums/delivery-status.enum';
import { Order } from '@/app/common/interfaces/order.interface';
import { useAdminOrders, useAdminStatistics } from '@/app/lib/hooks/useOrders';
interface Statistics {
  totalOrders: number;
  totalProductsSold: number;
  totalSales: number;
  awaitingDispatchCount: number;
}

const AdminPanel = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const itemsPerPage = 12;

  // Use React Query hooks
  const { data: ordersData, error: ordersError, isLoading: ordersLoading } = useAdminOrders(currentPage, itemsPerPage);
  const { data: statisticsData, error: statsError, isLoading: statsLoading } = useAdminStatistics();

  const isLoading = ordersLoading || statsLoading;
  const error = ordersError || statsError;

  // Extract orders and pagination data
  const orders = ordersData?.orders || [];
  const pageCount = ordersData?.pageCount || 1;

  // Extract statistics with fallback values
  const statistics = statisticsData || {
    totalOrders: 0,
    totalProductsSold: 0,
    totalSales: 0,
    awaitingDispatchCount: 0,
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = startItem + (orders?.length || 0) - 1;
  const totalItems = pageCount * itemsPerPage;

  if (isLoading) return <Loading />;
  if (error) return <NotFound />;

  return (
    <>
      <div className="p-6 bg-gray-200 text-black max-h-[calc(100vh-var(--header-height))] grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
          {[
            {
              icon: faBoxesStacked,
              count: statistics.totalOrders,
              label: 'Products sold',
            },
            { icon: faShoppingBag, count: statistics.totalOrders || 0, label: 'Orders' },
            {
              icon: faDollar,
              count: '$' + statistics.totalSales,
              label: 'Sales',
            },
            {
              icon: faBox,
              count: statistics.awaitingDispatchCount,
              label: 'Packages to dispatch',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group"
            >
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
                  {orders?.map((order: Order, index: number) => (
                    <tr
                      key={index}
                      className="cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                      onClick={() => router.push(`/admin-panel/order/${order._id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <div className="flex justify-center items-center w-full h-full">
                              <FontAwesomeIcon icon={faUser} size="2x" />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">{order.fullName}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{order.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        $
                        {order.items
                          .reduce(
                            (total: number, item: any) => total + (item?.priceAtTimeOfOrder || 0) * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                            order.paymentStatus === PaymentStatus.COMPLETED
                              ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                              : order.paymentStatus === PaymentStatus.PENDING
                              ? 'text-yellow-700 bg-yellow-100'
                              : order.paymentStatus === PaymentStatus.CANCELED
                              ? 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700'
                              : 'text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                            order.deliveryStatus === DeliveryStatus.DISPATCHED
                              ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                              : order.deliveryStatus === DeliveryStatus.NOT_DISPATCHED
                              ? 'text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700'
                              : 'text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'
                          }`}
                        >
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
              <span className="flex items-center col-span-3">
                Showing {startItem}-{endItem} of {totalItems}
              </span>
              <span className="col-span-2"></span>

              <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul className="inline-flex items-center">
                    <li>
                      <button
                        onClick={() => {
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                        aria-label="Previous"
                        disabled={currentPage === 1}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                    </li>
                    {Array.from({ length: pageCount }, (_, index) => {
                      const page = index + 1;
                      return (
                        <li key={page}>
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 transition-colors duration-150 border border-r-0 focus:outline-none focus:shadow-outline-purple ${
                              currentPage === page
                                ? 'text-white bg-blue-600 dark:bg-gray-100 dark:text-gray-800 border-blue-600 dark:border-gray-100'
                                : 'text-gray-700 bg-white dark:bg-gray-800'
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        onClick={() => {
                          if (currentPage < pageCount) setCurrentPage(currentPage + 1);
                        }}
                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                        aria-label="Next"
                        disabled={currentPage === pageCount}
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
