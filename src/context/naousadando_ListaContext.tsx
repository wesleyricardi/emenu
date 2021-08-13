import { createContext, useState, useEffect, useContext } from "react";
import { API } from "../config";

type TypeList = {
  ItemList: [List];
  AllItens: [Itens];
};

interface List {
  id: string;
  nome: string;
  itens: [Itens];
}

interface Itens {
  id: string;
  nome: string;
  disponibilidade: number;
  preco: number;
  descricao: string;
  foto: string;
}

export const ListContext = createContext({} as TypeList);

export default function ListProvider({ children }: any) {
  const [ItemList, setItemList] = useState<[List]>();
  const [AllItens, setAllItens] = useState<[Itens]>();

  useEffect(() => {
    const getItemList = async () => {
      const req = await fetch(`${API}/api/lista-itens`);
      const list = await req.json();

      setItemList(list);
      const allItens = list.reduce((acumulador, categoria) => {
        return [...acumulador, ...categoria.itens];
      }, []);
      setAllItens(allItens);
    };
    getItemList();
  }, []);

  return (
    <ListContext.Provider
      value={{
        ItemList,
        AllItens,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  const { ItemList, AllItens } = context;
  return { ItemList, AllItens };
}
