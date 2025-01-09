import React from 'react';
import Image from 'next/image';
const Header = () => {
  return (
    <header className="flex items-center justify-between px-10 py-4">
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
        <ul className="flex items-center space-x-4">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about" className="px-28">
              About
            </a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="w-[220px] flex items-center justify-around">
        <button className="px-4 py-2 bg-yellow-300">Login</button>
        <button className="px-4 py-2 bg-yellow-300">Register</button>
      </div>
    </header>
  );
};

export default Header;
