import { createContext, useContext, useEffect, useState } from "react";

import getCart from "../components/cart/getCartItem";

type Cart = {
  cart: [CartList] | null;
  setCart: Function;
  sendtoCart: Item | null;
  setsendtoCart: Function;
};

type CartList = {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  foto: string;

  quantidade: number;
  observacao: string;
  order: string;
};

type Item = {
  id: string;
  nome: string;
  disponibilidade: number;
  preco: number;
  descricao: string;
  foto: string;
};

export const CartContext = createContext({} as Cart);

export default function CartProvider({ children }: any) {
  const [cart, setCart] = useState<[CartList] | null>(null);
  const [sendtoCart, setsendtoCart] = useState<Item | null>(null);

  useEffect(() => {
    async function getCartList() {
      const List = await getCart();
      setCart(List);
    }
    getCartList();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        sendtoCart,
        setsendtoCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useItemInCart() {
  const context = useContext(CartContext);
  const { cart, setCart } = context;
  return { cart, setCart };
}

export function useSendItemtoCart() {
  const context = useContext(CartContext);
  const { sendtoCart, setsendtoCart } = context;
  return { sendtoCart, setsendtoCart };
}
