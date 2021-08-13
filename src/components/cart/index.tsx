import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useItemInCart, useSendItemtoCart } from "../../context/CartContext";
import Insert from "./insert";
import Check from "./check";
import Finish from "./finish";
import Button from "./bt_cart";

import styles from "../../css/components/cart/index.module.css";

type CartList = {
  id: number;
  nome: string;
  preco: number;
  foto: string;
  descricao: string;
  quantidade: number;
  observacao: string | null;
  order: string;
};

const Cart = () => {
  const [Step, setStep] = useState<number | null>(null);
  const [Update, set2Update] = useState<CartList | null>(null);
  const [pathnameLocation, setpathnameLocation] = useState(null);
  const { cart } = useItemInCart();
  const { sendtoCart, setsendtoCart } = useSendItemtoCart();

  const router = useRouter();
  const { id: id_mesa } = router.query;

  useEffect(() => {
    window.onpopstate = function () {
      handleBackArrow();
    };
  }, [sendtoCart, Step]);

  useEffect(() => {
    setpathnameLocation(window.location.pathname);
  }, []);

  const send2Update = (e: any) => {
    let order: string = e.target.id.substring(3);
    if (!order) order = e.target.parentNode.id.substring(3);
    const item = cart.filter((item) => {
      if (item.order === order) {
        return item;
      } else return null;
    });
    if (item.length) {
      history.pushState(null, null, `cardapio/item/${item[0].id}`);
      set2Update(item[0]);
      setStep(1);
    }
  };

  function closeAll() {
    history.pushState(null, null, pathnameLocation);
    setStep(0);
    set2Update(null);
    setsendtoCart(null);
  }

  const handleBackArrow = () => {
    if (Step === 2 || sendtoCart) {
      closeAll();
    } else if (Step === 1) {
      history.pushState(null, null, `/mesa/${id_mesa}/`);
      setStep(2);
      set2Update(null);
    } else if (Step === 3) {
      setStep(0);
    }
  };

  return (
    <>
      <div
        id={styles.cart_container}
        onClick={closeAll}
        className={Step || sendtoCart ? "" : styles.close_cart_container}
      >
        <div className="max-width-600" onClick={(e) => e.stopPropagation()}>
          <span id="backArrow">
            <img
              onClick={handleBackArrow}
              src="/images/arrow.png"
              alt="flecha de voltar"
            />
          </span>
          <span
            style={
              Step === 1 || sendtoCart
                ? { transform: "translate(0, 0px)" }
                : Step === 2
                ? { transform: "translate(100%, 0px)" }
                : { transform: "translate(200%, 0px)" }
            }
          ></span>
          {(Step === 1 || sendtoCart) && (
            <Insert setStep={setStep} item={Update ? Update : sendtoCart} />
          )}
          {Step === 2 && (
            <Check
              setStep={setStep}
              send2Update={send2Update}
              closeAll={closeAll}
            />
          )}
          {Step === 3 && <Finish />}
        </div>
      </div>
      {cart && <Button CartAmout={cart.length} setStep={setStep} />}
    </>
  );
};

export default Cart;
