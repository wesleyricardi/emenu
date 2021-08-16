import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API } from "../../config/index.json";
import Loading from "../_extra/loading";
import { useItemInCart } from "../../context/CartContext";
import { useAuthentication } from "../../context/AuthContext";
import { useBillAuthentication } from "../../context/BillContext";
import getCartItem from "./getCartItem";
import clearCartItem from "./clear";

import styles from "../../css/components/cart/finish.module.css";

type itens = {
  id: number;
  qtd: number;
  descricao: string;
}[];

export default function Finish() {
  const [loaded, setloaded] = useState<boolean>(false);

  const { Bill } = useBillAuthentication();
  const { User } = useAuthentication();
  const { setCart } = useItemInCart();
  const [Message, setMessage] = useState<string>("Enviando pedido...");
  const router = useRouter();
  const { id: id_mesa } = router.query;

  useEffect(() => {
    if (id_mesa !== undefined) setloaded(true);
  }, [id_mesa]);

  useEffect(() => {
    history.pushState(null, null, `cardapio/finish`);
    async function checkOut(
      bill: number,
      user: number,
      itens: itens
    ): Promise<void> {
      const req = await fetch(`${API}/sendtobill`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ bill, user, itens }),
      });

      const { code } = await req.json();
      if (code === 201) {
        clearCartItem();
        setCart(null);
        setMessage("Pedido realizado com sucesso");
      } else {
        setMessage("Falha ao realizar o pedido");
      }
    }

    async function startCheckOut() {
      const cartItems = await getCartItem();
      const cartItemsReady = cartItems.map((item) => ({
        id: item.id,
        qtd: item.quantidade,
        descricao: item.observacao,
      }));
      checkOut(Bill.id, User, cartItemsReady);
    }

    startCheckOut();
  }, []);

  if (loaded) {
    return (
      <div id={styles.cart_finish} className="grid-center-center">
        <h1>{Message}</h1>
        {Message === "Pedido realizado com sucesso" && (
          <Link href={`/mesa/${id_mesa}/pedidos`}>
            <a>
              <button>IR PARA MEUS PEDIDOS</button>
            </a>
          </Link>
        )}
      </div>
    );
  } else {
    return <Loading />;
  }
}
