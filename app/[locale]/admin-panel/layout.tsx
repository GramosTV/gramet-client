import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faList, faPlus } from '@fortawesome/free-solid-svg-icons';
interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-slate-500 text-black dark:text-white ">
      <div className="flex justify-start align-center min-h-[calc(100vh-var(--header-height))]">
        <div className="flex flex-col w-14 hover:w-64 md:w-64 bg-blue-900 dark:bg-gray-900 text-white transition-all duration-300 border-none z-10 sidebar">
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5 hidden md:block">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
                </div>
              </li>
              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <FontAwesomeIcon icon={faBars} />
                  <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">icon</span>
                  <span className="ml-2 text-sm tracking-wide truncate">Board</span>
                  <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">
                    New
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">icon</span>
                  <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">icon</span>
                  <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                  <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                    1.2k
                  </span>
                </a>
              </li>
              <li className="px-5 hidden md:block">
                <div className="flex flex-row items-center mt-5 h-8">
                  <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Products</div>
                </div>
              </li>
              <li>
                <Link
                  href="/admin-panel/products"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <FontAwesomeIcon className="inline-flex justify-center items-center ml-4" icon={faList} />
                  <span className="ml-2 text-sm tracking-wide truncate">View Products</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-panel/products/add"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
                >
                  <FontAwesomeIcon className="inline-flex justify-center items-center ml-4" icon={faPlus} />
                  <span className="ml-2 text-sm tracking-wide truncate">Add Product</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="grow flex bg-gray-200">{children}</div>
      </div>
    </div>
  );
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Link href="/admin-panel/products/add" className="mx-8">
        Add Products
      </Link>
      <Link href="/admin-panel/products" className="mx-8">
        View Products
      </Link>
      <Link href="/admin-panel/products/edit" className="mx-8">
        Edit Products
      </Link>
    </div>
  );
};

export default AdminLayout;
