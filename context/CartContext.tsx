// // context/CartContext.tsx
// import { Cart } from '@/app/common/index';
// import { fetchWithAuth } from '@/app/lib/auth-api';
// import { useQuery } from '@tanstack/react-query';
// import React, { createContext, useContext, useState } from 'react';
// import { set } from 'react-hook-form';

// const CartContext = createContext<{
//   cart: Cart | [];
//   setCart: (cart: Cart) => void;
// }>({
//   cart: [],
//   setCart: () => {},
// });

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cart, setCart] = useState<Cart>([]);
//   useQuery({
//     queryKey: ['cart'],
//     queryFn: async () => {
//       const response = await fetchWithAuth('/api/cart');
//       const data = await response.json();
//       setCart(data.itemData);
//       return data;
//     },
//     retry: 1,
//   });

//   return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
// };

// export const useCart = () => useContext(CartContext);
