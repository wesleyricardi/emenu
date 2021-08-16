import Head from "next/head";
import Header from "../../../../components/header";
import Cart from "../../../../components/cart";
import Cardapio from "../../../../components/cardapio";
import Footer from "../../../../components/footer";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../../../components/_extra/loading";
import { API } from "../../../../config/index.json";

interface Categories {
  id: number;
  nome: string;
}

interface Itens {
  id: string;
  nome: string;
  disponibilidade: number;
  categoria: number;
  preco: number;
  descricao: string;
  foto: string;
}

function Home() {
  const [Items, setItems] = useState<[Itens] | undefined>(undefined);
  const [Categories, setCategories] = useState<[Categories] | undefined>(
    undefined
  );
  const [loaded, setloaded] = useState<boolean>(false);
  const router = useRouter();
  const { id: id_mesa } = router.query;

  useEffect(() => {
    if (
      id_mesa !== undefined &&
      Items !== undefined &&
      Categories !== undefined
    )
      setloaded(true);
  }, [id_mesa, Items, Categories]);

  useEffect(() => {
    if (id_mesa) {
      const day = new Date();
      day.setTime(day.getTime() + 1000 * 60 * 60);
      document.cookie = `cardapio.mesa=${id_mesa};expires=${day.toUTCString()}; path=/`;
    }
  }, [id_mesa]);

  useEffect(() => {
    const getList = async () => {
      const req = await fetch(`${API}/all-items`);
      const req2 = await fetch(`${API}/categories`);

      const items = await req.json();
      setItems(items);

      const categories = await req2.json();
      setCategories(categories);
    };
    getList();
  }, []);

  if (loaded)
    return (
      <>
        <Head>
          <title>Cardapio Online</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Cart />
        <Cardapio items={Items} categories={Categories} />
        <Footer />
      </>
    );
  else return <Loading />;
}

export default Home;
