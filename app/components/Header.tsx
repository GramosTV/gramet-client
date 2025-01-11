'use client';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { Cart, Category } from '../common';
import { useLocalStorage } from 'usehooks-ts';
import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '../lib/auth-api';

const Page = () => {
  return <AuthProvider children={<Header />} />;
};

const Header = () => {
  const { isLoggedIn, user } = useAuth();
  useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetchWithAuth('/api/cart');
      const data = await response.json();
      setCart(data.itemData);
      return data;
    },
    retry: 1,
  });
  const [cart, setCart, removeValue] = useLocalStorage<Cart>('cart', []);

  return (
    <div className="navbar bg-base-100 h-[var(--header-height)]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/store">All</Link>
              <ul className="p-2">
                <li>
                  <Link href={`/store/?category=${Category.FURNITURE_HANDLES}`}>Furniture handles</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.FURNITURE_KNOBS}`}>Furniture knobs</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.FURNITURE_HOOKS}`}>Furniture hooks</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.FURNITURE_FEET}`}>Furniture feet</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.FURNITURE_LIGHTING}`}>Furniture lighting</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.TECHNICAL_ACCESSORIES}`}>Technical accessories</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.METAL_DECORATIONS}`}>Metal decorations</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.CARGO_BASKETS}`}>Cargo baskets</Link>
                </li>
                <li>
                  <Link href={`/store/?category=${Category.DRAWERS}`}>Drawers</Link>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-[700]">GRAMET &trade;</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className="flex justify-center items-center px-2">
            <Link href="/" className="font-[600]">
              Home
            </Link>
          </li>
          <div className="dropdown dropdown-hover px-2">
            <Link
              href="/store"
              tabIndex={0}
              role="button"
              className="btn py-[.5rem] px-[1rem] h-[100%] min-h-[100%] my-[auto] bg-transparent shadow-none border-none"
            >
              Store
            </Link>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <Link href="/store">All</Link>
                <ul>
                  <li>
                    <Link href={`/store/?category=${Category.FURNITURE_HANDLES}`}>Furniture handles</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.FURNITURE_KNOBS}`}>Furniture knobs</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.FURNITURE_HOOKS}`}>Furniture hooks</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.FURNITURE_FEET}`}>Furniture feet</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.FURNITURE_LIGHTING}`}>Furniture lighting</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.TECHNICAL_ACCESSORIES}`}>Technical accessories</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.METAL_DECORATIONS}`}>Metal decorations</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.CARGO_BASKETS}`}>Cargo baskets</Link>
                  </li>
                  <li>
                    <Link href={`/store/?category=${Category.DRAWERS}`}>Drawers</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <li className="flex justify-center items-center px-2">
            <a className="font-[600]">Item 3</a>
          </li>
        </ul>
      </div>
      {isLoggedIn ? (
        <div className="navbar-end gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">
                  {cart?.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            </div>
            <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
              <div className="card-body">
                <span className="text-lg font-bold">{cart?.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
                <span className="text-info">
                  Subtotal: ${cart?.reduce((sum, item) => sum + item.quantity * item.price, 0)}
                </span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">View cart</button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full flex items-center justify-center" style={{ display: 'flex' }}>
                <FontAwesomeIcon icon={faUser} size="xl" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end gap-3">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-active btn-neutral">Register</button>
        </div>
      )}
    </div>
  );
};

export default Page;
