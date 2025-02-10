'use client';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from 'usehooks-ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '../lib/auth-api';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Category } from '../common/enums/category.enum';
import { Cart } from '../common/interfaces/cart.interface';

const Header = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth(`/api/auth/logout`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
    },
    onSuccess: () => {
      toast.success('Successfully logged out');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to logout');
    },
  });

  useQuery({
    queryKey: ['cart', user],
    queryFn: async () => {
      if (user) {
        const response = await fetchWithAuth('/api/cart');
        const data = await response.json();
        setCart(data.itemData);
        return data;
      }
      return null;
    },
    retry: 1,
  });
  const logout = async () => {
    setUser(null);
    setCart([]);
    await mutation.mutateAsync();
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  };
  const [cart, setCart, removeValue] = useLocalStorage<Cart>('cart', []);
  return (
    <div className="navbar h-[var(--header-height)] max-w-[1200px] mx-auto p-0 flex flex-col justify-between">
      <div className="grow w-[1200px]">
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
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
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
          <a className="btn btn-ghost text-xl font-[700] p-0">GRAMET &trade;</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            <li className="flex justify-center items-center">
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
        {user ? (
          <div className="navbar-end gap-2 flex">
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
              <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-64 shadow">
                <div className="card-body">
                  <span className="text-lg font-bold">{cart?.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
                  <ul className="menu menu-md bg-base-200 rounded-lg w-42">
                    {cart.map((item, i) => {
                      return (
                        <li key={item.name + i}>
                          <a>
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/products/image/${item._id}`}
                              alt={`${item.name} image`}
                              width={25}
                              height={25}
                              style={{ height: '25px' }}
                              className="rounded-sm"
                            />
                            {item.name.length > 20 ? `${item.name.slice(0, 15)}...` : item.name} x{item.quantity}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <span className="text-info">
                    Subtotal: ${cart?.reduce((sum, item) => sum + item.quantity * item.price, 0)}
                  </span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block" onClick={() => router.push('/checkout')}>
                      Checkout
                    </button>
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
                  <Link href="/orders" className="justify-between">
                    Orders
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li onClick={logout}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-end gap-3 flex">
            <Link href="/login" className="btn btn-outline">
              Login
            </Link>
            <Link href="/register" className="btn btn-active btn-neutral">
              Register
            </Link>
          </div>
        )}
      </div>
      <div className="w-[1200px] h-[2px] bg-blue-700 opacity-50"></div>
    </div>
  );
};

export default Header;
