import { useEffect, useState } from "react";
import { AppName } from "../../config/index.json";
import { useItemInCart, useSendItemtoCart } from "../../context/CartContext";
import getCart from "./getCartItem";

import styles from "../../css/components/cart/insert.module.css";
import Price from "../_extra/price";

interface props {
  setStep?: Function;
  item: {
    id: string | number;
    nome: string;
    preco: number;
    descricao: string;
    foto: string;

    quantidade?: number;
    observacao?: string | null;
    order?: string;
  };
}

const Cart = ({ setStep, item }: props) => {
  let [Amount, saveAmount] = useState<number>(1);
  let [Observation, setObservation] = useState<string>("");

  const { cart, setCart } = useItemInCart();
  const { setsendtoCart } = useSendItemtoCart();

  useEffect(() => {
    if (item.quantidade) saveAmount(item.quantidade);
    if (item.observacao) setObservation(item.observacao);
  }, []);

  const InsertInCart = async () => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    let Order: string;
    if (!item.order) {
      Order = Math.random().toString(36).slice(2);
    } else {
      Order = item.order;
    }

    document.cookie = `${AppName}_CartItem_${Order}={"id":${item.id},"nome":"${
      item.nome
    }","quantidade":${Amount},"observacao":"${Observation}","order":"${Order}"}; expires=${day.toUTCString()}`;
    const cartList = await getCart();
    setCart(cartList);

    if (setStep && item.order) setStep(2);
    else {
      setStep(0);
      setsendtoCart(null);
    }
  };

  const setAmount = (e: any) => {
    const className = e.target.className;
    if (className === "increase") saveAmount(Amount + 1);
    else if (className === "decrease" && Amount > 1) saveAmount(Amount - 1);
  };

  const writeObservation = (e: any) => {
    const Observation = e.target.value;
    setObservation(Observation);
  };

  const DeletingItem = (e: any) => {
    const order: string = e.target.id.substring(4);
    const newCart = cart?.filter((item) => {
      if (item.order === order) {
        document.cookie = `${AppName}_CartItem_${item.order}={}; expires=Thu, 18 Dec 2013 12:00:00 UTC;`;
        return null;
      } else return item;
    });

    if (newCart && newCart.length > 0) {
      setCart(newCart);
      if (setStep) setStep(2);
    } else {
      setCart(null);
      if (setStep) setStep(2);
    }
  };

  return (
    <div id={styles.insert}>
      <img src={`/fotos/${item.foto}`} alt="imagem" />
      <div>
        <div>{item.nome}</div>

        <div>{item.descricao}</div>

        <div>
          <Price>{item.preco}</Price>
        </div>

        <div>
          <label>Incluir observação:</label>
          <input
            type="text"
            onChange={writeObservation}
            value={Observation}
            name="observacao"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="max-width-600">
        <span>
          <span className="decrease" onClick={setAmount}>
            {" "}
            -{" "}
          </span>
          <b>{Amount}</b>
          <span onClick={setAmount} className="increase">
            {" "}
            +{" "}
          </span>
        </span>
        <button onClick={InsertInCart}>
          {item.order ? "Atualizar" : "Adicionar"} {Amount} |{" "}
          <Price>{Amount * item.preco}</Price>
        </button>
      </div>
      {item.order && (
        <div
          onClick={DeletingItem}
          id={`del_${item.order}`}
          className="excluir"
        >
          excluir item do carrinho
        </div>
      )}
    </div>
  );
};

export default Cart;
