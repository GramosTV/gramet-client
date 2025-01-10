'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';

const Page = () => {
  return <AuthProvider children={<Header />} />;
};
const Header = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="flex items-center justify-between px-10 py-4 h-[var(--header-height)] bg-slate-300">
      <div className="h-20 overflow-hidden">
        <Image
          width={220}
          height={220}
          className="object-cover object-center h-full"
          src="/images/logo.png"
          alt={''}
        ></Image>
      </div>
      <nav>
        <ul className="flex items-center justify-between gap-6">
          <li className="text-center">
            <Link className="px-8 font-bold text-xl" href="/">
              Home
            </Link>
          </li>
          <li className="text-center">
            <Link className="px-8 font-bold text-xl" href="/store">
              Shop
            </Link>
          </li>
          <li className="text-center">
            <Link className="px-8 font-bold text-xl" href="/about">
              About
            </Link>
          </li>
          <li className="text-center">
            <Link className="px-8 font-bold text-xl" href="/contact">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-[220px] flex items-center justify-end">
        {isLoggedIn ? (
          <>
            <FontAwesomeIcon icon={faUser} size="2xl" className="mx-3" />
            <FontAwesomeIcon icon={faBasketShopping} size="2xl" className="mx-3" />
          </>
        ) : (
          <>
            <Link href="login" className="px-4 py-2 bg-yellow-300">
              Login
            </Link>
            <button className="px-4 py-2 bg-yellow-300">Register</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Page;
