import React from 'react';
import AddProducts from './products/add/page';
import Link from 'next/link';

const AdminPanel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Link href="/admin-panel/products/add" className="mx-8">
        Add Products
      </Link>
      <Link href="/admin-panel/products/view" className="mx-8">
        View Products
      </Link>
      <Link href="/admin-panel/products/edit" className="mx-8">
        Edit Products
      </Link>
    </div>
  );
};

export default AdminPanel;
